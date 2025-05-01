/**
 * 移动端菜单切换脚本
 * 保存为 assets/js/menu.js
 * 在所有页面底部引用
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取菜单切换按钮和导航元素
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // 检查元素是否存在
    if(menuToggle && mainNav) {
        // 添加点击事件监听器
        menuToggle.addEventListener('click', function() {
            // 切换导航的active类
            mainNav.classList.toggle('active');
            
            // 可选：切换按钮文字，从汉堡图标变为X
            // this.textContent = this.textContent === '☰' ? '✕' : '☰';
        });
        
        // 点击导航链接后自动关闭菜单
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // 如果窗口宽度小于768px，则关闭菜单
                if(window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    // 如果启用了上方的按钮文字切换，也需要改回
                    // menuToggle.textContent = '☰';
                }
            });
        });
    }
    
    // 标记当前活动页面
    markActivePage();
});

/**
 * 根据当前URL自动标记活动页面
 */
function markActivePage() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 遍历链接，查找匹配的路径
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // 处理首页
        if(currentPath === '/' || currentPath.endsWith('index.html')) {
            if(linkPath === 'index.html' || linkPath === '../index.html') {
                link.classList.add('active');
            }
        }
        // 处理其他页面
        else if(linkPath && currentPath.includes(linkPath.replace('../', ''))) {
            link.classList.add('active');
        }
    });
}
