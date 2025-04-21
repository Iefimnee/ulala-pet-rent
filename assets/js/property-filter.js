/**
 * 物件筛选系统
 * 功能：通过标签筛选物件列表
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有筛选标签
    const filterTags = document.querySelectorAll('.tag');
    // 获取所有物件卡片
    const propertyCards = document.querySelectorAll('.property-card');
    // 获取已选择的标签容器
    const selectedTagsContainer = document.getElementById('selected-tags');
    // 获取结果计数元素
    const resultCount = document.getElementById('result-count');
    // 获取没有标签时的消息
    const noTagsMessage = document.querySelector('.no-tags-message');
    // 获取文章内的可点击标签
    const propertyTags = document.querySelectorAll('.property-tag.clickable');
    
    // 存储当前已选的筛选条件
    let activeFilters = {
        area: [],
        pet: [],
        price: [],
        feature: []
    };
    
    // 为筛选区的标签添加点击事件
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            toggleTag(this);
            filterProperties();
        });
    });
    
    // 为文章内的标签添加点击事件
    propertyTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault(); // 防止页面跳转
            
            // 获取标签的筛选类型和值
            const filter = this.getAttribute('data-filter');
            const value = this.getAttribute('data-value');
            
            // 查找筛选区域中的匹配标签
            const matchingTag = findMatchingFilterTag(filter, value);
            
            if (matchingTag) {
                // 如果标签尚未被选中，则选中它
                if (!matchingTag.classList.contains('active')) {
                    toggleTag(matchingTag);
                    filterProperties();
                }
                
                // 滚动到筛选区域，让用户看到标签被激活
                matchingTag.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    // 清除所有标签的按钮事件
    document.getElementById('clear-tags').addEventListener('click', function() {
        clearAllTags();
    });
    
    /**
     * 查找匹配的筛选标签
     * @param {string} filter - 筛选类型
     * @param {string} value - 筛选值
     * @returns {Element|null} - 匹配的标签元素或null
     */
    function findMatchingFilterTag(filter, value) {
        return Array.from(filterTags).find(tag => 
            tag.getAttribute('data-filter') === filter && 
            tag.getAttribute('data-value') === value
        );
    }
    
    /**
     * 切换标签的激活状态
     * @param {Element} tag - 标签元素
     */
    function toggleTag(tag) {
        const filter = tag.getAttribute('data-filter');
        const value = tag.getAttribute('data-value');
        
        // 如果是价格区间，一次只能选一个
        if (filter === 'price' && !tag.classList.contains('active')) {
            // 取消所有其他价格标签的选中状态
            document.querySelectorAll(`.tag[data-filter="price"].active`).forEach(activeTag => {
                activeTag.classList.remove('active');
                // 从激活的筛选条件中移除
                const valueIndex = activeFilters[filter].indexOf(activeTag.getAttribute('data-value'));
                if (valueIndex > -1) {
                    activeFilters[filter].splice(valueIndex, 1);
                }
            });
        }
        
        // 切换标签激活状态
        tag.classList.toggle('active');
        
        // 更新激活的筛选条件
        if (tag.classList.contains('active')) {
            activeFilters[filter].push(value);
        } else {
            const index = activeFilters[filter].indexOf(value);
            if (index > -1) {
                activeFilters[filter].splice(index, 1);
            }
        }
        
        updateSelectedTags();
    }
    
    /**
     * 更新已选择的标签显示
     */
    function updateSelectedTags() {
        // 清空已选标签容器
        selectedTagsContainer.innerHTML = '';
        
        // 检查是否有已选标签
        let hasSelectedTags = false;
        
        // 遍历所有激活的筛选条件
        for (const [filter, values] of Object.entries(activeFilters)) {
            values.forEach(value => {
                hasSelectedTags = true;
                
                // 创建已选标签元素
                const selectedTag = document.createElement('span');
                selectedTag.className = 'selected-tag';
                
                // 设置标签文本
                let tagText = value;
                if (filter === 'price') {
                    // 价格标签可能需要特殊显示
                    const priceTag = document.querySelector(`.tag[data-filter="price"][data-value="${value}"]`);
                    if (priceTag) {
                        tagText = priceTag.textContent;
                    }
                }
                
                selectedTag.textContent = tagText;
                
                // 添加移除按钮
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-tag';
                removeBtn.innerHTML = '&times;';
                removeBtn.setAttribute('data-filter', filter);
                removeBtn.setAttribute('data-value', value);
                
                // 添加移除按钮的点击事件
                removeBtn.addEventListener('click', function() {
                    const tagFilter = this.getAttribute('data-filter');
                    const tagValue = this.getAttribute('data-value');
                    
                    // 找到并取消激活对应的筛选标签
                    const filterTag = document.querySelector(`.tag[data-filter="${tagFilter}"][data-value="${tagValue}"]`);
                    if (filterTag) {
                        toggleTag(filterTag);
                        filterProperties();
                    }
                });
                
                selectedTag.appendChild(removeBtn);
                selectedTagsContainer.appendChild(selectedTag);
            });
        }
        
        // 显示或隐藏"没有选择标签"的消息
        if (hasSelectedTags) {
            if (noTagsMessage && noTagsMessage.parentNode === selectedTagsContainer) {
                selectedTagsContainer.removeChild(noTagsMessage);
            }
        } else {
            const message = document.createElement('p');
            message.className = 'no-tags-message';
            message.textContent = 'まだタグが選択されていません';
            selectedTagsContainer.appendChild(message);
        }
    }
    
    /**
     * 根据已选标签筛选物件
     */
    function filterProperties() {
        let visibleCount = 0;
        
        // 遍历所有物件卡片
        propertyCards.forEach(card => {
            // 默认显示所有卡片
            let shouldShow = true;
            
            // 检查每种筛选条件
            for (const [filter, values] of Object.entries(activeFilters)) {
                // 如果该筛选条件有选中的值
                if (values.length > 0) {
                    // 获取卡片的该属性值
                    const cardValue = card.getAttribute(`data-${filter}`);
                    
                    // 特殊处理价格范围
                    if (filter === 'price') {
                        const cardPrice = parseInt(cardValue);
                        shouldShow = shouldShow && values.some(range => {
                            if (range === '~50000') return cardPrice <= 50000;
                            if (range === '50000-70000') return cardPrice > 50000 && cardPrice <= 70000;
                            if (range === '70000-100000') return cardPrice > 70000 && cardPrice <= 100000;
                            if (range === '100000-') return cardPrice > 100000;
                            return false;
                        });
                    } 
                    // 其他属性可能有多个值（逗号分隔）
                    else {
                        const cardValues = cardValue.split(',');
                        // 检查是否有交集（至少符合一个选中的值）
                        const hasMatch = values.some(value => cardValues.includes(value));
                        shouldShow = shouldShow && hasMatch;
                    }
                }
            }
            
            // 根据筛选结果显示或隐藏卡片
            if (shouldShow) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 更新结果计数
        resultCount.textContent = visibleCount;
    }
    
    /**
     * 清除所有已选标签
     */
    function clearAllTags() {
        // 重置所有激活的筛选条件
        activeFilters = {
            area: [],
            pet: [],
            price: [],
            feature: []
        };
        
        // 取消所有标签的激活状态
        filterTags.forEach(tag => {
            tag.classList.remove('active');
        });
        
        // 更新已选标签显示
        updateSelectedTags();
        
        // 重新筛选物件（显示所有）
        filterProperties();
    }
    
    // 初始化显示
    updateSelectedTags();
    filterProperties();
});