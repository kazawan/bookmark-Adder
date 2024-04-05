let srcList;
const getImageBtn = document.getElementById('get');


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var url = tabs[0].url;
    // var desc = tabs[0].description;
    var title = tabs[0].title;
    var favIconUrl = tabs[0].favIconUrl;
    // console.log(tabs[0])
    document.getElementById('url').innerHTML = url;
    document.getElementById('title').innerHTML = title;
    // document.getElementById('description').innerHTML = desc;
    document.getElementById("selected-img").innerHTML = `<img src="${favIconUrl}" />`;
    const pin = document.querySelector('.pin');
    pin.addEventListener('click', () => {
        document.getElementById("selected-img").innerHTML = `<img src="${favIconUrl}" />`;
    })
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    let message = { start: true };
    // 向content scripts发送消息
    chrome.tabs.sendMessage(tab.id, message, (res) => {
        console.log(res);   
        const {imgSrcList,description} = res;
        srcList = Array.from(new Set(imgSrcList));
        // popup中展示图片
        const imgList = srcList.map((src) => `<img src="${src}" />`).join('');
        // console.log(imgList);

        document.getElementById('app').innerHTML = imgList;
        document.getElementById('description').innerHTML = description;
        const img = document.querySelectorAll('img');
        img.forEach((item) => {
            item.addEventListener('click', () => {
                // 向background发送消息
                const src = item.src;
                document.getElementById("selected-img").innerHTML = `<img src="${src}" />`;
            });
        });
    });
});




var taginput = document.getElementById('taginput');
function addTag(tag) {
    taginput.value += " ";
    taginput.value += tag;
    
}

var tagbox = document.getElementById('tagbox');
const getTagsUrl = 'http://localhost:3000/getTags';
fetch(getTagsUrl).then((res) => {

    return res.json();
}).then((res) => {
    console.log(res);   
    const tags = res.data;
    tags.forEach((tag) => {
        tagbox.innerHTML += `<span class="tag" value="${tag}"  >${tag}</span>`;
    });
    const tag = document.querySelectorAll('.tag');
    tag.forEach((item) => {
        item.addEventListener('click', () => {
            addTag(item.innerText);
        });
    })
});


const createBtn = document.getElementById('create');
createBtn.addEventListener('click', async () => {
    const selectedImg = document.getElementById("selected-img").querySelector('img');
    const image = selectedImg.src;
    const title = document.getElementById('title').innerText;
    const url = document.getElementById('url').innerText;
    const description = document.getElementById('description').innerText;
    // 向background发送消息
  

    let fetchData = {
        image,
        title,
        url,
        description,
        tags: taginput.value
    }

    const createUrl = 'http://localhost:3000/insert';
    const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchData)
    }).then((res) => {
        return res.json();
    }).then((res) => {
        return res;
    });
    // alert('创建成功');
   if(res.code === 200){
       alert('创建成功');
       // 关闭当前页面
         window.close();
    }else{
        alert('创建失败');
        
    }

})




// getImageBtn.addEventListener('click', async () => {
//     // 获取当前活动页
    
// });



