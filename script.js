// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize card modal functionality
function initCardModals() {
    const modal = document.getElementById('contentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModals = document.querySelectorAll('.close-modal');
    const readMoreBtns = document.querySelectorAll('.read-more-btn:not([onclick])'); // Exclude case study buttons
    const cardContents = document.querySelectorAll('.card-content');
    
    // Close modals when clicking the close button
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
    
    // Open modal when clicking read more button (only for original cards, not case study)
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.card-content');
            const title = card.querySelector('.title');
            const fullContent = card.querySelector('.card-full-content');
            
            // Check if elements exist before accessing them
            if (title && fullContent && modalTitle && modalContent && modal) {
                modalTitle.textContent = title.textContent;
                modalContent.innerHTML = fullContent.innerHTML;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Note: Removed card click functionality to avoid duplicate modal triggers
    // Only read more button will trigger the modal now
}

// Add fade-in animation to sections on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section, .box').forEach(el => {
        observer.observe(el);
    });
}

// Removed initExpandButtons function - using modal popup instead

// Initialize findings carousel
function initFindingsCarousel() {
    const carousel = document.querySelector('.findings-carousel');
    if (!carousel) return;
    
    const carouselInner = carousel.querySelector('.findings-carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Set initial active state
    updateCarousel();
    
    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Update carousel position and active states
    function updateCarousel() {
        // Update carousel position
        carouselInner.style.transform = `translateX(-${currentIndex * 90}%)`;
        
        // Update active indicator
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Lazy load chart when container becomes visible
function initChartLazyLoading() {
    const chartContainer = document.getElementById('global-chart');
    if (!chartContainer) return;
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !window.__chartMounted) {
                loadPlotly().then(() => {
                    renderGlobalChart();
                    // Hide loading indicator
                    const loadingEl = document.getElementById('chart-loading');
                    if (loadingEl) {
                        loadingEl.style.display = 'none';
                    }
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    chartObserver.observe(chartContainer);
}

// Lazy load images when they become visible
function initImageLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loading');
                    
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    };
                    tempImg.src = img.dataset.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
}

// Initialize image zoom functionality
function initImageZoom() {
    const imageModal = document.getElementById('imageModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    
    zoomableImages.forEach(img => {
        img.addEventListener('click', () => {
            zoomedImage.src = img.src || img.dataset.src;
            imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close image modal when clicking outside
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initCardModals();
    initScrollAnimations();
    initChartLazyLoading();
    initImageLazyLoading();
    initImageZoom();
    initFindingsCarousel();
    initCaseStudyCharts();
});
    
    // Add resize listener for chart responsiveness
    window.addEventListener('resize', function() {
        if (window.Plotly && document.getElementById('global-chart') && window.__chartMounted) {
            Plotly.Plots.resize('global-chart');
        }
    });

// ============ Plotly chart (Global leaderboard) ============}

// Modal functions for case study
function showPromptModal() {
    document.getElementById('promptModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showPromptModal2() {
    document.getElementById('promptModal2').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showPromptModal3() {
    document.getElementById('promptModal3').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showResponseModal(model) {
    const modalId = model + 'Modal';
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showResponseModal2(model) {
    const modalId = model + 'Modal2';
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showResponseModal3(model) {
    const modalId = model + 'Modal3';
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Chart rendering functions
function renderBarChart(canvasId, data) {
  console.log('renderBarChart called with:', canvasId, data);
  
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error('Canvas not found:', canvasId);
    return;
  }
  
  console.log('Canvas found:', canvas);
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  console.log('Canvas dimensions:', width, height);
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Chart settings - use more space for chart
  const padding = 20;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Data
  const labels = ['Score', 'Acc', 'Flu', 'App'];
  const values = [data.score, data.accuracy, data.fluency, data.appropriateness];
  const maxValue = Math.max(...values);
  
  console.log('Chart data:', { labels, values, maxValue });
  
  // Low saturation color palette for bars
  const colors = [
    '#7BA7D4', // 清新蓝色 for Score
    '#82C882', // 清新绿色 for Accuracy  
    '#F4B366', // 清新橙色 for Fluency
    '#E57373'  // 清新红色 for Appropriateness
  ];
  
  // Bar settings - make bars wider
  const barWidth = chartWidth / labels.length * 0.8;
  const barSpacing = chartWidth / labels.length;
  
  // Store bar positions for hover detection
  const barPositions = [];
  
  // Draw bars
  values.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
    const y = padding + chartHeight - barHeight;
    
    console.log(`Drawing bar ${index}:`, { value, barHeight, x, y, barWidth });
    
    // Store position for hover detection
    barPositions.push({ x, y, width: barWidth, height: barHeight, index });
    
    // Draw bar with solid color (no gradient)
    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw value on top of bar
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(value, x + barWidth / 2, y - 8);
  });
  
  // 在柱子下方绘制 X 轴短标签
  ctx.fillStyle = '#555';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  labels.forEach((label, index) => {
    const xCenter = padding + index * barSpacing + (barSpacing - barWidth) / 2 + barWidth / 2;
    const yBase = padding + chartHeight + 15;
    ctx.fillText(label, xCenter, yBase);
  });
  
  console.log('Bars drawn, setting up event listeners...');
  
  // Only add event listeners if they haven't been added before
  if (!canvas.dataset.listenersAdded) {
    console.log('Adding event listeners for', canvasId);
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('chart-tooltip-' + canvasId);
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'chart-tooltip-' + canvasId;
      tooltip.style.position = 'absolute';
      tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '8px 12px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '12px';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.display = 'none';
      tooltip.style.zIndex = '1000';
      document.body.appendChild(tooltip);
      console.log('Tooltip created for', canvasId);
    }
    
    // Store current chart data for event handlers
    canvas.chartData = { barPositions, labels };
    
    // Add hover functionality
    canvas.addEventListener('mousemove', function(e) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      let hoveredBar = null;
      
      // Check which bar is being hovered using stored data
      if (canvas.chartData && canvas.chartData.barPositions) {
        canvas.chartData.barPositions.forEach(bar => {
          if (mouseX >= bar.x && mouseX <= bar.x + bar.width &&
              mouseY >= bar.y && mouseY <= bar.y + bar.height) {
            hoveredBar = bar;
          }
        });
      }
      
      if (hoveredBar && canvas.chartData.labels) {
        canvas.style.cursor = 'pointer';
        
        // Show tooltip with dimension name
        tooltip.textContent = canvas.chartData.labels[hoveredBar.index];
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
        console.log('Showing tooltip:', canvas.chartData.labels[hoveredBar.index]);
      } else {
        canvas.style.cursor = 'default';
        tooltip.style.display = 'none';
      }
    });
    
    // Hide tooltip when mouse leaves canvas
    canvas.addEventListener('mouseleave', function() {
      canvas.style.cursor = 'default';
      tooltip.style.display = 'none';
    });
    
    // Mark that listeners have been added
    canvas.dataset.listenersAdded = 'true';
    console.log('Event listeners added for', canvasId);
  } else {
    console.log('Event listeners already exist for', canvasId, ', updating chart data');
    // Update chart data for existing event handlers
    canvas.chartData = { barPositions, labels };
  }
  
  console.log('renderBarChart completed for', canvasId);
}

function initCaseStudyCharts() {
    console.log('Initializing case study charts...');
    
    // Check if canvas elements exist
    const gpt5Canvas = document.getElementById('gpt5Chart');
    const claudeCanvas = document.getElementById('claudeChart');
    const deepseekCanvas = document.getElementById('deepseekChart');
    
    console.log('Canvas elements:', { gpt5Canvas, claudeCanvas, deepseekCanvas });
    
    // GPT-5 data
    if (gpt5Canvas) {
        console.log('Rendering GPT-5 chart...');
        renderBarChart('gpt5Chart', {
            score: 90,
            accuracy: 60,
            fluency: 20,
            appropriateness: 10
        });
    }
    
    // Claude data
    if (claudeCanvas) {
        console.log('Rendering Claude chart...');
        renderBarChart('claudeChart', {
            score: 63,
            accuracy: 45,
            fluency: 8,
            appropriateness: 10
        });
    }
    
    // DeepSeek data
    if (deepseekCanvas) {
        console.log('Rendering DeepSeek chart...');
        renderBarChart('deepseekChart', {
            score: 46,
            accuracy: 25,
            fluency: 16,
            appropriateness: 5
        });
    }
    
    // Initialize Finding 2 charts
    const gpt5Canvas2 = document.getElementById('gpt5Chart2');
    
    console.log('Finding 2 Canvas elements:', { gpt5Canvas2 });
    
    // GPT-5 Finding 2 data (score 81, acc 45, flu 16, app 20)
    if (gpt5Canvas2) {
        console.log('Rendering GPT-5 Finding 2 chart...');
        renderBarChart('gpt5Chart2', {
            score: 81,
            accuracy: 45,
            fluency: 16,
            appropriateness: 20
        });
    }
    
    // Initialize Finding 3 charts
    const nonThinkingCanvas3 = document.getElementById('nonThinkingChart3');
    const thinkingCanvas3 = document.getElementById('thinkingChart3');
    
    console.log('Finding 3 Canvas elements:', { nonThinkingCanvas3, thinkingCanvas3 });
    
    // Non-thinking response data (score 71, acc 45, flu 6, app 20)
    if (nonThinkingCanvas3) {
        console.log('Rendering Non-thinking Finding 3 chart...');
        renderBarChart('nonThinkingChart3', {
            score: 71,
            accuracy: 45,
            fluency: 6,
            appropriateness: 20
        });
    }
    
    // Thinking response data (score 14, acc 0, flu 4, app 10)
    if (thinkingCanvas3) {
        console.log('Rendering Thinking Finding 3 chart...');
        renderBarChart('thinkingChart3', {
            score: 14,
            accuracy: 0,
            fluency: 4,
            appropriateness: 10
        });
    }
}
