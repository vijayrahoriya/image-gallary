const apiKey = 'uu2yoBUhiHbci7AtFEeJS6SHvyr4hFpzRxl5W3uOchudog98mPhKs1Wd'
let perPage = 15;
let currentPage = 1;
let query = null;

const imageContainer = document.querySelector('.images'),
loadMoreBtn = document.querySelector('.load-more'),
inputSearch = document.querySelector('.search input'),
lightBox = document.querySelector('.lightbox'),
closeBtn = document.querySelector('.lightbox .buttons .fa-times'),
downloadBtn = document.querySelector('.lightbox .fa-download');


const downloadImage = (imgUrl) => {
    fetch(imgUrl).then(res=> res.blob()).then(file=> {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(err=> alert('Failed to download'))
}

const showLightBox = (img, photographer) => {
    lightBox.querySelector('img').src = img
    lightBox.querySelector('.photographer span').innerText = photographer
    lightBox.classList.add('active');
    document.body.style.overflow = 'hidden'
    downloadBtn.setAttribute('data-img', img);
}

closeBtn.addEventListener('click', ()=> {
    lightBox.classList.remove('active');
    document.body.style.overflow = 'auto'
})

const getHtml = (images) => {
    imageContainer.innerHTML += images.map(img=> 
            ` <li class="card" onclick="showLightBox('${img.src.large2x}', '${img.photographer}')">
                <img src=${img.src.large2x} alt="">
                <div class="details">
                    <div class="photographer">
                        <i class="fa fa-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImage('${img.src.large2x}'); event.stopPropagation();"><i class="fa fa-download"></i></button>
                </div>
            </li>`
    ).join("")
}


const getImages = (apiUrl) => {
    loadMoreBtn.innerHTML = "Loading..."
    loadMoreBtn.classList.add('disabled')
    fetch(apiUrl, {
        headers:{
            Authorization: apiKey
        }
    }).then((res)=> res.json()).then(data=> {
        getHtml(data.photos)
        loadMoreBtn.innerHTML = "Load More"
        loadMoreBtn.classList.remove('disabled')
    }).catch((err)=> {
        alert('Failed to load images')
    })
}

const getMoreImages = () => {
    currentPage++;
    let apiURl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`

    apiURl = query ? `https://api.pexels.com/v1/search?query=${query}&curated?page=${currentPage}&per_page=${perPage}` : apiURl
    getImages(apiURl)
}

const getSearchImages = (e) => {
    if(e.target.value === "") return query = null;
    if(e.key == 'Enter'){
        currentPage = 1;
        query = e.target.value
        imageContainer.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${query}&curated?page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', getMoreImages)
inputSearch.addEventListener('keyup', getSearchImages)
downloadBtn.addEventListener('click', (e)=> {
    downloadImage(e.target.dataset.img)
})