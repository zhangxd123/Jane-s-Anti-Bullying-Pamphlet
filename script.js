document.addEventListener('DOMContentLoaded', function() {
    const images = Array.from({length: 18}, (_, i) => `D:/jane/P${i+1}.png`);
    let currentImageIndex = 0;
    let isFlipping = false;
    const comicImage = document.querySelector('.comic-image');
    
    // 初始化指示器
    const indicators = document.querySelector('.indicators');
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `indicator ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showImage(i));
        indicators.appendChild(dot);
    });

    // 创建页面元素
    const initialPage = createPage(images[0]);
    comicImage.appendChild(initialPage);

    function createPage(imgSrc) {
        const page = document.createElement('div');
        page.className = 'page';
        const img = document.createElement('img');
        img.src = imgSrc;
        page.appendChild(img);
        
        const backSide = document.createElement('div');
        backSide.className = 'page-back';
        page.appendChild(backSide);
        
        return page;
    }

    function showImage(index) {
        if (isFlipping) return;
        isFlipping = true;

        const currentPage = comicImage.querySelector('.page');
        const newPage = createPage(images[index]);
        
        // 添加新页面但先不显示
        newPage.style.opacity = '0';
        comicImage.appendChild(newPage);

        // 开始翻页动画
        requestAnimationFrame(() => {
            currentPage.classList.add('flipping');
            
            setTimeout(() => {
                newPage.style.opacity = '1';
                comicImage.removeChild(currentPage);
                isFlipping = false;
            }, 800);
        });

        // 更新指示器
        document.querySelectorAll('.indicator').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentImageIndex = index;
    }

    // 箭头按钮事件
    document.querySelector('.left-arrow').addEventListener('click', () => {
        if (currentImageIndex > 0) {
            showImage(currentImageIndex - 1);
        }
    });

    document.querySelector('.right-arrow').addEventListener('click', () => {
        if (currentImageIndex < images.length - 1) {
            showImage(currentImageIndex + 1);
        }
    });

    // 触摸事件支持
    let touchStartX = 0;
    
    comicImage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    comicImage.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentImageIndex < images.length - 1) {
                showImage(currentImageIndex + 1);
            } else if (diff < 0 && currentImageIndex > 0) {
                showImage(currentImageIndex - 1);
            }
        }
    });

    // 导航菜单切换
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            
            document.querySelectorAll('nav li').forEach(li => {
                li.classList.remove('active');
            });
            link.parentElement.classList.add('active');
        });
    });

    // 键盘和滚轮导航
    const sections = ['comics', 'speech', 'making'];
    let currentSectionIndex = 0;

    function switchSection(direction) {
        currentSectionIndex = (currentSectionIndex + direction + sections.length) % sections.length;
        document.querySelector(`a[href="#${sections[currentSectionIndex]}"]`).click();
    }

    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) switchSection(1);
        else if (e.deltaY < 0) switchSection(-1);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') switchSection(1);
        else if (e.key === 'ArrowUp') switchSection(-1);
        else if (e.key === 'ArrowLeft' && sections[currentSectionIndex] === 'comics') {
            document.querySelector('.left-arrow').click();
        }
        else if (e.key === 'ArrowRight' && sections[currentSectionIndex] === 'comics') {
            document.querySelector('.right-arrow').click();
        }
    });
}); 