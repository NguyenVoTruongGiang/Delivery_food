<script>
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  // Dữ liệu giả lập
  const companyInfo = {
    name: "Delivery Food",
    mission:
      "Chúng tôi cam kết mang đến những bữa ăn ngon, nhanh chóng và tiện lợi, đảm bảo chất lượng từ nhà bếp đến tay bạn. Với công nghệ hiện đại và đội ngũ tận tâm, chúng tôi xây dựng trải nghiệm ẩm thực vượt mong đợi.",
    vision:
      "Trở thành nền tảng giao hàng thức ăn nhanh hàng đầu Việt Nam, kết nối hàng triệu khách hàng với các nhà hàng chất lượng, đồng thời thúc đẩy phát triển bền vững và cộng đồng thịnh vượng.",
  };

  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Nhà sáng lập",
      image: "/assets/food_img/food_img/sushi.jpg",
      bio: "Hơn 10 năm kinh nghiệm trong ngành công nghệ và ẩm thực.",
    },
    {
      name: "Trần Thị B",
      role: "Giám đốc vận hành",
      image: "/assets/food_img/food_img/sushi.jpg",
      bio: "Chuyên gia tối ưu hóa quy trình giao hàng.",
    },
    {
      name: "Lê Văn C",
      role: "Trưởng phòng công nghệ",
      image: "/assets/food_img/food_img/sushi.jpg",
      bio: "Lãnh đạo phát triển nền tảng AI giao hàng.",
    },
    {
      name: "Phạm Thị D",
      role: "Giám đốc marketing",
      image: "/assets/food_img/food_img/sushi.jpg",
      bio: "Sáng tạo chiến lược thu hút hàng triệu khách hàng.",
    },
  ];

  const achievements = [
    {
      label: "Đơn hàng đã giao",
      value: "150,000+",
      icon: "🚚",
      desc: "Phục vụ hàng ngàn bữa ăn mỗi ngày.",
    },
    {
      label: "Khách hàng hài lòng",
      value: "75,000+",
      icon: "😊",
      desc: "Đánh giá 4.8/5 trên mọi nền tảng.",
    },
    {
      label: "Đối tác nhà hàng",
      value: "800+",
      icon: "🍽️",
      desc: "Hợp tác với các thương hiệu uy tín.",
    },
    {
      label: "Thời gian giao trung bình",
      value: "25 phút",
      icon: "⏱️",
      desc: "Nhanh nhất thị trường.",
    },
  ];

  const timeline = [
    {
      year: "2018",
      event: "Thành lập Delivery Food, bắt đầu với 10 nhà hàng đối tác.",
    },
    { year: "2020", event: "Ra mắt ứng dụng di động, đạt 10,000 người dùng." },
    {
      year: "2022",
      event: "Mở rộng ra 10 thành phố lớn, hợp tác với 500 nhà hàng.",
    },
    {
      year: "2024",
      event: "Tích hợp AI tối ưu tuyến đường, đạt 100,000 đơn hàng.",
    },
    { year: "2025", event: "Đặt mục tiêu phục vụ 1 triệu khách hàng." },
  ];

  const coreValues = [
    {
      icon: "🔥",
      name: "Tốc độ",
      desc: "Giao hàng nhanh chóng, đảm bảo món ăn nóng hổi.",
    },
    {
      icon: "🌟",
      name: "Chất lượng",
      desc: "Cam kết thực phẩm tươi ngon, an toàn.",
    },
    {
      icon: "🤝",
      name: "Tin cậy",
      desc: "Xây dựng niềm tin với khách hàng và đối tác.",
    },
    {
      icon: "🌍",
      name: "Bền vững",
      desc: "Góp phần bảo vệ môi trường và cộng đồng.",
    },
  ];

  const partners = [
    { name: "Nhà hàng A", logo: "/assets/images/welcome.png" },
    { name: "Nhà hàng B", logo: "/assets/images/welcome.png" },
    { name: "Nhà hàng C", logo: "/assets/images/welcome.png" },
  ];

  const testimonials = [
    {
      name: "Khách hàng A",
      quote: "Giao hàng siêu nhanh, đồ ăn vẫn nóng! Rất hài lòng.",
      image: "/assets/food_img/food_img/sushi.jpg",
    },
    {
      name: "Khách hàng B",
      quote: "Dịch vụ tuyệt vời, nhân viên thân thiện.",
      image: "/assets/food_img/food_img/sushi.jpg",
    },
  ];

  const community = {
    desc: "Chúng tôi tổ chức các chương trình từ thiện, hỗ trợ cộng đồng khó khăn và thúc đẩy lối sống xanh.",
    initiatives: [
      "Tặng 10,000 bữa ăn miễn phí cho người vô gia cư.",
      "Hợp tác với tổ chức tái chế bao bì.",
      "Tài trợ học bổng cho học sinh nghèo.",
    ],
  };

  const contactInfo = {
    email: "support@deliveryfood.com",
    phone: "+84 123 456 789",
    address: "789 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    social: [
      { name: "Facebook", url: "https://facebook.com", icon: "📘" },
      { name: "Instagram", url: "https://instagram.com", icon: "📸" },
      { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
    ],
  };

  let scrollY = 0;
  let sectionsVisible = {
    mission: false,
    achievements: false,
    timeline: false,
    values: false,
    partners: false,
    testimonials: false,
    community: false,
    contact: false,
  };

  function handleScroll() {
    scrollY = window.scrollY;
    sectionsVisible.mission = scrollY > 200;
    sectionsVisible.achievements = scrollY > 800;
    sectionsVisible.timeline = scrollY > 1400;
    sectionsVisible.values = scrollY > 2000;
    sectionsVisible.partners = scrollY > 2600;
    sectionsVisible.testimonials = scrollY > 3200;
    sectionsVisible.community = scrollY > 3800;
    sectionsVisible.contact = scrollY > 4400;
  }

  // Xử lý form liên hệ
  let contactForm = { name: "", email: "", message: "" };
  let formError = "";
  let formSuccess = "";

  async function handleSubmit() {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      formError = "Vui lòng điền đầy đủ thông tin.";
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!response.ok) throw new Error("Gửi thất bại");
      formSuccess = "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.";
      formError = "";
      contactForm = { name: "", email: "", message: "" };
    } catch (error) {
      formError = "Có lỗi xảy ra. Vui lòng thử lại.";
      formSuccess = "";
    }
  }

  // Carousel đối tác
  let currentPartnerIndex = 0;
  let partnerInterval;
  function nextPartner() {
    currentPartnerIndex = (currentPartnerIndex + 1) % partners.length;
  }
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    partnerInterval = setInterval(nextPartner, 3000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(partnerInterval);
    };
  });
</script>

<svelte:head>
  <title>Giới thiệu - Delivery Food</title>
  <meta
    name="description"
    content="Khám phá Delivery Food: Sứ mệnh, đội ngũ, và những giá trị chúng tôi mang đến cho cộng đồng."
  />
</svelte:head>

<main class="about-page">
  <!-- Hero Section -->
  <section class="hero" style="transform: translateY({scrollY * 0.3}px);">
    <img
      src="/assets/images/welcome.png"
      alt="Food Delivery"
      class="hero-image"
    />
    <div class="hero-content" in:fade={{ duration: 1000, easing: cubicOut }}>
      <h1 class="hero-title">Chào mừng đến với {companyInfo.name}</h1>
      <p class="hero-subtitle">
        Mang ẩm thực đến mọi nhà, nhanh chóng và trọn vẹn!
      </p>
      <p class="hero-slogan">"Ăn ngon, sống trọn từng khoảnh khắc."</p>
      <div class="hero-cta">
        <a href="/order" class="cta-btn primary">Đặt hàng ngay</a>
        <a href="#contact" class="cta-btn secondary">Liên hệ chúng tôi</a>
      </div>
    </div>
  </section>

  <!-- Mission & Vision -->
  <section class="mission-vision">
    {#if sectionsVisible.mission}
      <div
        class="mission"
        in:slide={{ duration: 800, easing: cubicOut, delay: 200 }}
      >
        <span class="section-icon">🌟</span>
        <h2>Sứ mệnh của chúng tôi</h2>
        <p>{companyInfo.mission}</p>
      </div>
      <div
        class="vision"
        in:slide={{ duration: 800, easing: cubicOut, delay: 400 }}
      >
        <span class="section-icon">🚀</span>
        <h2>Tầm nhìn</h2>
        <p>{companyInfo.vision}</p>
      </div>
    {/if}
  </section>

  <!-- Achievements -->
  <section
    class="achievements"
    style="transform: translateY({scrollY * 0.1}px);"
  >
    {#if sectionsVisible.achievements}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>Thành tựu nổi bật</h2>
      <div class="achievements-grid">
        {#each achievements as achievement, i}
          <div
            class="achievement-card"
            in:slide={{ duration: 800, easing: cubicOut, delay: i * 200 }}
          >
            <span class="icon">{achievement.icon}</span>
            <h3>{achievement.value}</h3>
            <p class="label">{achievement.label}</p>
            <p class="desc">{achievement.desc}</p>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Timeline -->
  <section class="timeline">
    {#if sectionsVisible.timeline}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>Lịch sử phát triển</h2>
      <div class="timeline-container">
        {#each timeline as event, i}
          <div
            class="timeline-item {i % 2 === 0 ? 'left' : 'right'}"
            in:slide={{ duration: 800, easing: cubicOut, delay: i * 200 }}
          >
            <div class="timeline-content">
              <h3>{event.year}</h3>
              <p>{event.event}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Core Values -->
  <section class="core-values">
    {#if sectionsVisible.values}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>Giá trị cốt lõi</h2>
      <div class="values-grid">
        {#each coreValues as value, i}
          <div
            class="value-card"
            in:slide={{ duration: 800, easing: cubicOut, delay: i * 200 }}
          >
            <span class="icon">{value.icon}</span>
            <h3>{value.name}</h3>
            <p>{value.desc}</p>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Partners -->
  <section class="partners">
    {#if sectionsVisible.partners}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>Đối tác tiêu biểu</h2>
      <div class="partners-carousel">
        <div
          class="carousel-wrapper"
          style="transform: translateX(-{currentPartnerIndex * 100}%);"
        >
          {#each partners as partner}
            <div class="partner-card">
              <img src={partner.logo} alt={partner.name} class="partner-logo" />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- Testimonials -->
  <section class="testimonials">
    {#if sectionsVisible.testimonials}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>
        Câu chuyện khách hàng
      </h2>
      <div class="testimonials-grid">
        {#each testimonials as testimonial, i}
          <div
            class="testimonial-card"
            in:slide={{ duration: 800, easing: cubicOut, delay: i * 200 }}
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              class="testimonial-image"
            />
            <p class="quote">"{testimonial.quote}"</p>
            <h3>{testimonial.name}</h3>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Community -->
  <section class="community" style="transform: translateY({scrollY * 0.1}px);">
    {#if sectionsVisible.community}
      <h2 in:fade={{ duration: 800, easing: cubicOut }}>
        Tầm ảnh hưởng cộng đồng
      </h2>
      <p in:fade={{ duration: 800, easing: cubicOut, delay: 200 }}>
        {community.desc}
      </p>
      <div class="community-grid">
        {#each community.initiatives as initiative, i}
          <div
            class="community-card"
            in:slide={{ duration: 800, easing: cubicOut, delay: i * 200 }}
          >
            <p>{initiative}</p>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Footer -->
  <section class="contact" id="contact">
    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h4>About Us</h4>
          <p>
            Delivery Food is your go-to platform for fast and delicious meals
            delivered to your door.
          </p>
          <a href="/about">Learn More</a>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: support@deliveryfood.com</p>
          <p>Phone: +84 123 456 789</p>
          <a href="/contact">Get in Touch</a>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank">Facebook</a>
            <a href="https://twitter.com" target="_blank">Twitter</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Delivery Food. All rights reserved.</p>
      </div>
    </footer>
  </section>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
  }

  .about-page {
    /* Gradient chính mềm mại */
    background: linear-gradient(135deg, #fefce8 0%, #d1fae5 100%);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  .about-page::before {
    /* Hiệu ứng grain nhẹ */
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2P8z8Dwn4GBgYGBgQEA5eMC8c1MdyYAAAAASUVORK5CYII=");
    opacity: 0.04;
    pointer-events: none;
  }

  /* Hero */
  .hero {
    /* Gradient aurora động */
    background: linear-gradient(135deg, #ff4d4f 0%, #ff8e53 50%, #ff4d4f 100%);
    background-size: 200% 200%;
    animation: aurora 12s ease-in-out infinite;
    color: white;
    text-align: center;
    padding: 100px 20px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.25) 0%,
      transparent 60%
    );
    animation: gradientPulse 8s infinite ease-in-out;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 60px;
    font-weight: 800;
    margin-bottom: 15px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 22px;
    margin-bottom: 10px;
    opacity: 0.95;
    line-height: 1.4;
  }

  .hero-slogan {
    font-size: 16px;
    font-style: italic;
    margin-bottom: 25px;
    opacity: 0.85;
  }

  .hero-cta {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 20px;
  }

  .cta-btn {
    padding: 12px 28px;
    border-radius: 40px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
  }

  .cta-btn.primary {
    background: #1e293b;
    color: white;
  }

  .cta-btn.secondary {
    background: transparent;
    border: 2px solid white;
    color: white;
  }

  .cta-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  .hero-image {
    max-width: 350px;
    margin-top: 15px;
    animation: float 5s infinite ease-in-out;
  }

  /* Mission & Vision */
  .mission-vision {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 60px 30px;
    background: #ffffff;
    position: relative;
    border-radius: 20px;
    margin: 20px;
  }

  .mission-vision::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.95)
    );
    backdrop-filter: blur(2px);
    opacity: 0.1;
  }

  .mission,
  .vision {
    padding: 30px;
    border-radius: 15px;
    background: rgba(249, 250, 251, 0.9);
    backdrop-filter: blur(8px);
    transition: transform 0.4s ease-in-out;
  }

  .mission:hover,
  .vision:hover {
    transform: translateY(-10px);
  }

  .section-icon {
    font-size: 28px;
    margin-bottom: 10px;
    display: block;
  }

  .mission h2,
  .vision h2 {
    font-size: 28px;
    color: #ff4d4f;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .mission p,
  .vision p {
    font-size: 15px;
    color: #4b5563;
    line-height: 1.7;
  }

  /* Achievements */
  .achievements {
    padding: 60px 30px;
    text-align: center;
    background: linear-gradient(to bottom, #d1fae5 0%, #ecfdf5 100%);
    margin: 20px;
    border-radius: 20px;
  }

  .achievements h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 30px;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }

  .achievement-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
    transition:
      transform 0.4s ease-in-out,
      box-shadow 0.4s ease-in-out;
  }

  .achievement-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .achievement-card .icon {
    font-size: 40px;
    margin-bottom: 10px;
    animation: pulse 2.5s infinite ease-in-out;
  }

  .achievement-card h3 {
    font-size: 24px;
    color: #ff4d4f;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .achievement-card .label {
    font-size: 15px;
    color: #6b7280;
    font-weight: 600;
  }

  .achievement-card .desc {
    font-size: 13px;
    color: #4b5563;
    margin-top: 5px;
  }

  /* Timeline */
  .timeline {
    padding: 60px 30px;
    background: #fafaf9;
    text-align: center;
    position: relative;
    margin: 20px;
    border-radius: 20px;
  }

  .timeline::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, #ff4d4f10, transparent);
    opacity: 0.15;
  }

  .timeline h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 30px;
  }

  .timeline-container {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .timeline-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #ff4d4f, #ff8e53);
    transform: translateX(-50%);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 30px;
  }

  .timeline-item.left .timeline-content {
    margin-right: 55%;
    text-align: right;
  }

  .timeline-item.right .timeline-content {
    margin-left: 55%;
    text-align: left;
  }

  .timeline-content {
    background: rgba(249, 250, 251, 0.9);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
    transition: transform 0.4s ease-in-out;
  }

  .timeline-content:hover {
    transform: translateY(-8px);
  }

  .timeline-content h3 {
    font-size: 18px;
    color: #ff4d4f;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .timeline-content p {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
  }

  /* Core Values */
  .core-values {
    padding: 60px 30px;
    background: #fafaf9;
    text-align: center;
    margin: 20px;
    border-radius: 20px;
  }

  .core-values h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 30px;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }

  .value-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
    transition: transform 0.4s ease-in-out;
  }

  .value-card:hover {
    transform: translateY(-8px);
  }

  .value-card .icon {
    font-size: 36px;
    margin-bottom: 10px;
  }

  .value-card h3 {
    font-size: 18px;
    color: #1f2937;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .value-card p {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
  }

  /* Partners */
  .partners {
    padding: 60px 30px;
    background: #ffffff;
    text-align: center;
    margin: 20px;
    border-radius: 20px;
  }

  .partners h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 30px;
  }

  .partners-carousel {
    overflow: hidden;
    max-width: 1200px;
    margin: 0 auto;
  }

  .carousel-wrapper {
    display: flex;
    transition: transform 0.6s ease-in-out;
  }

  .partner-card {
    flex: 0 0 33.33%; /* 3 partners nên mỗi card chiếm 1/3 */
    padding: 15px;
  }

  .partner-logo {
    max-width: 120px;
    height: auto;
    filter: grayscale(70%);
    transition:
      filter 0.4s ease-in-out,
      transform 0.4s ease-in-out;
  }

  .partner-card:hover .partner-logo {
    filter: grayscale(0);
    transform: scale(1.08);
  }

  /* Testimonials */
  .testimonials {
    padding: 60px 30px;
    background: #ffffff;
    text-align: center;
    margin: 20px;
    border-radius: 20px;
  }

  .testimonials h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 30px;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .testimonial-card {
    background: rgba(249, 250, 251, 0.9);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
    transition: transform 0.4s ease-in-out;
  }

  .testimonial-card:hover {
    transform: translateY(-8px);
  }

  .testimonial-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 10px;
    object-fit: cover;
  }

  .testimonial-card .quote {
    font-size: 14px;
    color: #4b5563;
    font-style: italic;
    margin-bottom: 10px;
    line-height: 1.6;
  }

  .testimonial-card h3 {
    font-size: 16px;
    color: #1f2937;
    font-weight: 600;
  }

  /* Community */
  .community {
    padding: 60px 30px;
    background: linear-gradient(to bottom, #d1fae5 0%, #fefce8 100%);
    text-align: center;
    margin: 20px;
    border-radius: 20px;
  }

  .community h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 20px;
  }

  .community p {
    font-size: 15px;
    color: #6b7280;
    max-width: 800px;
    margin: 0 auto 30px;
    line-height: 1.7;
  }

  .community-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  .community-card {
    background: rgba(249, 250, 251, 0.9);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
    transition: transform 0.4s ease-in-out;
  }

  .community-card:hover {
    transform: translateY(-8px);
  }

  .community-card p {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
  }

  /* Contact */
  .contact {
    padding: 60px 30px;
    background: #ecfdf5;
    position: relative;
    margin: 20px;
    border-radius: 20px;
  }

  .contact::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    opacity: 0.1;
  }

  .contact h2 {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    text-align: center;
    margin-bottom: 20px;
  }

  .contact p {
    font-size: 15px;
    color: #6b7280;
    text-align: center;
    margin-bottom: 30px;
    line-height: 1.7;
  }

  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .contact-form {
    padding: 25px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
  }

  .form-error {
    color: #dc2626;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .form-success {
    color: #16a34a;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease-in-out;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    border-color: #ff4d4f;
    outline: none;
  }

  .contact-form textarea {
    height: 90px;
    resize: vertical;
  }

  .submit-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }

  .submit-btn::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition:
      width 0.5s ease-in-out,
      height 0.5s ease-in-out;
  }

  .submit-btn:hover::before {
    width: 180px;
    height: 180px;
  }

  .submit-btn:hover {
    transform: translateY(-3px);
  }

  .contact-info {
    padding: 25px;
    background: rgba(249, 250, 251, 0.9);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(6px);
  }

  .contact-info p {
    font-size: 14px;
    margin-bottom: 12px;
    color: #4b5563;
    line-height: 1.6;
  }

  .contact-info a {
    color: #ff4d4f;
    text-decoration: none;
    transition: color 0.3s ease-in-out;
  }

  .contact-info a:hover {
    color: #ff8e53;
  }

  .social-links {
    display: flex;
    gap: 15px;
    margin-top: 15px;
  }

  .social-icon {
    font-size: 16px;
    color: #1f2937;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    transition:
      transform 0.3s ease-in-out,
      color 0.3s ease-in-out;
  }

  .social-icon:hover {
    transform: scale(1.15);
    color: #ff4d4f;
  }

  .map-image {
    max-width: 100%;
    border-radius: 12px;
    margin-top: 15px;
  }

  /* Footer */
  .footer-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 40px 30px;
    background: linear-gradient(to right, #1e293b 0%, #0f172a 100%);
    color: #d1d5db;
  }

  .footer-section {
    margin: 0;
    padding: 15px;
  }

  .footer-section h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #ff4d4f;
  }

  .footer-section p,
  .footer-section a {
    font-size: 14px;
    color: #d1d5db;
    margin-bottom: 8px;
    text-decoration: none;
    line-height: 1.6;
  }

  .footer-section a:hover {
    color: #ff8e53;
  }

  .footer-section ul {
    padding: 0;
    list-style: none;
  }

  .footer-section li {
    margin-bottom: 8px;
  }

  .footer-section .social-links {
    flex-direction: column;
    gap: 8px;
  }

  .footer-bottom {
    background: #0f172a;
    text-align: center;
    padding: 15px;
    color: #d1d5db;
    font-size: 13px;
  }

  /* Keyframes */
  @keyframes aurora {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes gradientPulse {
    0% {
      transform: scale(0.9);
      opacity: 0.25;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.4;
    }
    100% {
      transform: scale(0.9);
      opacity: 0.25;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.85;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 767px) {
    .hero {
      padding: 60px 15px;
    }

    .hero-title {
      font-size: 36px;
    }

    .hero-subtitle {
      font-size: 18px;
    }

    .hero-slogan {
      font-size: 14px;
    }

    .hero-cta {
      flex-direction: column;
      gap: 10px;
    }

    .cta-btn {
      padding: 10px 20px;
      font-size: 14px;
    }

    .hero-image {
      max-width: 200px;
    }

    .mission-vision,
    .achievements-grid,
    .values-grid,
    .testimonials-grid,
    .community-grid,
    .contact-content,
    .footer-container {
      grid-template-columns: 1fr;
    }

    .mission,
    .vision,
    .achievement-card,
    .value-card,
    .testimonial-card,
    .community-card,
    .contact-form,
    .contact-info {
      padding: 15px;
      margin: 0 10px;
    }

    .mission h2,
    .vision h2,
    .achievements h2,
    .timeline h2,
    .core-values h2,
    .partners h2,
    .testimonials h2,
    .community h2,
    .contact h2 {
      font-size: 24px;
    }

    .timeline-container::before {
      left: 15px;
    }

    .timeline-item.left .timeline-content,
    .timeline-item.right .timeline-content {
      margin: 0 15px 0 40px;
      text-align: left;
    }

    .partner-card {
      flex: 0 0 100%;
    }

    .contact-form input,
    .contact-form textarea {
      font-size: 13px;
    }

    .submit-btn {
      font-size: 14px;
    }

    .footer-section {
      padding: 10px;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .hero {
      padding: 80px 20px;
    }

    .hero-title {
      font-size: 48px;
    }

    .mission-vision,
    .achievements-grid,
    .values-grid,
    .community-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .footer-container {
      grid-template-columns: repeat(2, 1fr);
    }

    .partner-card {
      flex: 0 0 50%;
    }
  }
</style>
