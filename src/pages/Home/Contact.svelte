<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';

    // Form data
    let formData = {
        customerName: '',
        email: '',
        issueDescription: ''
    };

    // Notifications
    let message = '';
    let error = '';
    let sending = false;
    let showSuccess = false;

    // Support categories
    let supportCategories = [
        { id: 'order', name: 'Đơn hàng' },
        { id: 'account', name: 'Tài khoản' },
        { id: 'payment', name: 'Thanh toán' },
        { id: 'app', name: 'Ứng dụng' },
        { id: 'other', name: 'Vấn đề khác' }
    ];
    
    let selectedCategory = 'other';

    // Submit support ticket
    async function submitTicket() {
        sending = true;
        error = '';
        
        try {
            // Add selected category to form data
            const requestData = {
                ...formData,
                category: selectedCategory
            };
            
            const response = await fetch('http://localhost:8080/api/support/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                message = 'Yêu cầu hỗ trợ đã được gửi thành công!';
                error = '';
                // Reset form
                formData = { customerName: '', email: '', issueDescription: '' };
                selectedCategory = 'other';
                showSuccess = true;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    showSuccess = false;
                }, 5000);
            } else {
                const data = await response.json();
                error = data.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
                message = '';
            }
        } catch (err) {
            error = 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.';
            message = '';
            console.error(err);
        } finally {
            sending = false;
        }
    }

    // Get user data if logged in
    onMount(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                if (user.name && user.email) {
                    formData.customerName = user.name;
                    formData.email = user.email;
                }
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    });
</script>

<div class="contact-page">
    <div class="contact-container">
        <div class="contact-header">
            <h2>Liên hệ hỗ trợ</h2>
            <p>Hãy để lại thông tin của bạn, đội ngũ hỗ trợ sẽ liên hệ lại trong thời gian sớm nhất.</p>
        </div>
        
        <div class="contact-content">
            <div class="contact-form-wrapper">
                {#if showSuccess}
                    <div class="success-message" transition:fly={{ y: -20, duration: 300 }}>
                        <div class="success-icon">✓</div>
                        <div class="success-text">
                            <h3>Gửi yêu cầu thành công!</h3>
                            <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                        </div>
                    </div>
                {:else}
                    <form on:submit|preventDefault={submitTicket} class="contact-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="customerName">Họ tên</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    placeholder="Nhập họ tên của bạn"
                                    bind:value={formData.customerName}
                                    required
                                />
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email liên hệ"
                                    bind:value={formData.email}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="category">Loại vấn đề</label>
                            <div class="category-selector">
                                {#each supportCategories as category}
                                    <label class="category-option">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            value={category.id}
                                            bind:group={selectedCategory}
                                        />
                                        <span class="category-label">{category.name}</span>
                                    </label>
                                {/each}
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="issueDescription">Chi tiết vấn đề</label>
                            <textarea
                                id="issueDescription"
                                placeholder="Mô tả chi tiết về vấn đề bạn đang gặp phải..."
                                bind:value={formData.issueDescription}
                                required
                            ></textarea>
                        </div>
                        
                        {#if error}
                            <div class="error-message" transition:fade={{ duration: 200 }}>{error}</div>
                        {/if}
                        
                        <button type="submit" class="submit-button" disabled={sending}>
                            {#if sending}
                                <div class="loading-spinner"></div>
                                Đang gửi...
                            {:else}
                                Gửi yêu cầu hỗ trợ
                            {/if}
                        </button>
                    </form>
                {/if}
            </div>
            
            <div class="contact-info">
                <div class="info-card">
                    <div class="info-icon">📱</div>
                    <h3>Hotline</h3>
                    <p>1900-1234</p>
                    <p class="sub-text">(8:00 - 21:00 hàng ngày)</p>
                </div>
                
                <div class="info-card">
                    <div class="info-icon">✉️</div>
                    <h3>Email</h3>
                    <p>support@fooddelivery.com</p>
                </div>
                
                <div class="info-card">
                    <div class="info-icon">🏢</div>
                    <h3>Văn phòng</h3>
                    <p>Tòa nhà A, Quận 1, TP. Hồ Chí Minh</p>
                </div>
                
                <div class="social-media">
                    <h3>Kết nối với chúng tôi</h3>
                    <div class="social-links">
                        <a href="#" class="social-icon">
                            <span class="material-icons">facebook</span>
                        </a>
                        <a href="#" class="social-icon">
                            <span class="material-icons">chat</span>
                        </a>
                        <a href="#" class="social-icon">
                            <span class="material-icons">mail</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="faq-section">
            <h3>Câu hỏi thường gặp</h3>
            <div class="faq-list">
                <div class="faq-item">
                    <h4>Làm thế nào để theo dõi đơn hàng?</h4>
                    <p>Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi".</p>
                </div>
                <div class="faq-item">
                    <h4>Thời gian giao hàng là bao lâu?</h4>
                    <p>Thời gian giao hàng trung bình là 30-45 phút tùy theo khoảng cách và điều kiện giao thông.</p>
                </div>
                <div class="faq-item">
                    <h4>Làm thế nào để hủy đơn hàng?</h4>
                    <p>Bạn có thể hủy đơn hàng trong vòng 5 phút sau khi đặt. Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .contact-page {
        background-color: #f9f9f9;
        padding: 40px 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .contact-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .contact-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .contact-header h2 {
        font-size: 32px;
        color: #ff6b6b;
        margin-bottom: 10px;
    }
    
    .contact-header p {
        color: #666;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .contact-content {
        display: flex;
        gap: 30px;
        margin-bottom: 50px;
    }
    
    .contact-form-wrapper {
        flex: 3;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }
    
    .contact-info {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .contact-form {
        padding: 30px;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
    }
    
    input, textarea {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s;
        color: #333;
    }
    
    input:focus, textarea:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }
    
    textarea {
        height: 150px;
        resize: vertical;
    }
    
    .category-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .category-option {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }
    
    .category-option input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .category-label {
        display: inline-block;
        padding: 8px 15px;
        background-color: #f5f5f5;
        border-radius: 20px;
        font-size: 14px;
        transition: all 0.2s;
    }
    
    .category-option input:checked + .category-label {
        background-color: #ff6b6b;
        color: white;
    }
    
    .submit-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: #ff6b6b;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 14px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .submit-button:hover {
        background-color: #ff5252;
    }
    
    .submit-button:disabled {
        background-color: #ffb8b8;
        cursor: not-allowed;
    }
    
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .info-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .info-icon {
        font-size: 24px;
        margin-bottom: 10px;
    }
    
    .info-card h3 {
        font-size: 18px;
        margin: 0 0 5px 0;
        color: #333;
    }
    
    .info-card p {
        margin: 0;
        color: #666;
    }
    
    .sub-text {
        font-size: 14px;
        color: #999;
        margin-top: 5px !important;
    }
    
    .social-media {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .social-media h3 {
        font-size: 18px;
        margin: 0 0 15px 0;
        color: #333;
    }
    
    .social-links {
        display: flex;
        gap: 15px;
    }
    
    .social-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #f5f5f5;
        border-radius: 50%;
        color: #666;
        text-decoration: none;
        transition: all 0.2s;
    }
    
    .social-icon:hover {
        background-color: #ff6b6b;
        color: white;
        transform: translateY(-3px);
    }
    
    .error-message {
        background-color: #ffe9e9;
        color: #d63031;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
    }
    
    .success-message {
        display: flex;
        align-items: center;
        padding: 40px 30px;
    }
    
    .success-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background-color: #4cd137;
        color: white;
        border-radius: 50%;
        font-size: 24px;
        margin-right: 20px;
    }
    
    .success-text h3 {
        margin: 0 0 5px 0;
        color: #333;
    }
    
    .success-text p {
        margin: 0;
        color: #666;
    }
    
    .faq-section {
        margin-top: 50px;
    }
    
    .faq-section h3 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
        color: #333;
    }
    
    .faq-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .faq-item {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .faq-item h4 {
        font-size: 16px;
        margin: 0 0 10px 0;
        color: #ff6b6b;
    }
    
    .faq-item p {
        margin: 0;
        color: #666;
        font-size: 14px;
        line-height: 1.6;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
        .contact-content {
            flex-direction: column;
        }
        
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .faq-list {
            grid-template-columns: 1fr;
        }
    }
</style>