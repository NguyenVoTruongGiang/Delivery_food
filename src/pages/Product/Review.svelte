<script>
  import { onMount } from "svelte";
  import { router } from "tinro";

  export let productId; // Prop passed from parent component

  let reviews = [];
  let rating = 0;
  let comment = "";
  let errorMessage = "";
  let successMessage = "";
  let isSubmitting = false;
  let isAuthenticated = false;
  let userId = null;

  const baseUrl = "http://localhost:8080";

  // Check authentication status
  onMount(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    isAuthenticated = !!token;
    if (user) {
      try {
        userId = JSON.parse(user).id;
      } catch (e) {
        console.error("Invalid user data in localStorage:", e);
      }
    }
    if (!isAuthenticated) {
      console.warn("User not authenticated. Redirecting to login...");
    }
    fetchReviews();
  });

  async function fetchReviews() {
    try {
      const response = await fetch(`${baseUrl}/reviews/product/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.goto("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      reviews = await response.json();
      console.log("Reviews fetched:", reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      errorMessage = "Failed to load reviews. Please try again.";
    }
  }

  async function submitReview() {
    if (!isAuthenticated) {
      alert("Please log in to submit a review.");
      router.goto("/login");
      return;
    }
    if (rating < 1 || rating > 5) {
      errorMessage = "Please select a rating between 1 and 5.";
      return;
    }
    isSubmitting = true;
    errorMessage = "";
    successMessage = "";
    try {
      const response = await fetch(`${baseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          rating,
          comment: comment || null,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.goto("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const newReview = await response.json();
      reviews = [newReview, ...reviews]; // Add new review to top
      rating = 0;
      comment = "";
      successMessage = "Review submitted successfully!";
      console.log("Review submitted:", newReview);
    } catch (error) {
      console.error("Error submitting review:", error);
      errorMessage = error.message || "Failed to submit review. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function setRating(value) {
    rating = value;
  }
</script>

<div class="reviews-container">
  <!-- Review Form -->
  {#if isAuthenticated}
    <section class="review-form">
      <h2>Write a Review</h2>
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
      {#if successMessage}
        <p class="success-message">{successMessage}</p>
      {/if}
      <div class="rating">
        <label>Rating:</label>
        <div class="stars">
          {#each [1, 2, 3, 4, 5] as star}
            <button
              class="star"
              class:selected={rating >= star}
              on:click={() => setRating(star)}
              disabled={isSubmitting}
            >
              ★
            </button>
          {/each}
        </div>
      </div>
      <div class="comment">
        <label for="comment">Comment (optional):</label>
        <textarea
          id="comment"
          bind:value={comment}
          placeholder="Write your review here..."
          rows="4"
          disabled={isSubmitting}
        ></textarea>
      </div>
      <button
        on:click={submitReview}
        disabled={isSubmitting}
        class="submit-btn"
      >
        {#if isSubmitting}
          Submitting...
        {:else}
          Submit Review
        {/if}
      </button>
    </section>
  {:else}
    <p class="login-prompt">
      Please <a href="/login">log in</a> to write a review.
    </p>
  {/if}

  <!-- Reviews List -->
  <section class="reviews-list">
    <h2>Reviews</h2>
    {#if reviews.length === 0}
      <p class="no-reviews">No reviews yet for this product.</p>
    {:else}
      {#each reviews as review}
        <div class="review">
          <div class="review-header">
            <span class="review-rating"
              >{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span
            >
            <span class="review-meta"
              >by {review.user.firstName || "Anonymous"} on
              {new Date(review.createdAt).toLocaleDateString()}</span
            >
          </div>
          {#if review.comment}
            <p class="review-comment">{review.comment}</p>
          {/if}
        </div>
      {/each}
    {/if}
  </section>
</div>

<style>
  .reviews-container {
    font-family: Arial, sans-serif;
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }

  /* Review Form */
  .review-form {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 32px;
    transition: box-shadow 0.2s;
  }

  .error-message {
    color: #dc3545;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .success-message {
    color: #28a745;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .rating {
    margin-bottom: 16px;
  }

  .rating label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  .stars {
    display: flex;
    gap: 4px;
  }

  .star {
    font-size: 24px;
    color: #d1d5db;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .star.selected {
    color: #f59e0b;
  }

  .star:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .comment {
    margin-bottom: 16px;
  }

  .comment label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }

  textarea:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  .submit-btn {
    background-color: #3b82f6;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .submit-btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  /* Login Prompt */
  .login-prompt {
    color: #4b5563;
    font-size: 16px;
    margin-bottom: 32px;
  }

  .login-prompt a {
    color: #3b82f6;
    text-decoration: none;
  }

  .login-prompt a:hover {
    text-decoration: underline;
  }

  /* Reviews List */
  .reviews-list {
  }

  .no-reviews {
    color: #4b5563;
    font-size: 16px;
  }

  .review {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 16px;
    transition: box-shadow 0.2s;
  }

  .review-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .review-rating {
    font-size: 18px;
    color: #f59e0b;
  }

  .review-meta {
    margin-left: 8px;
    font-size: 14px;
    color: #6b7280;
  }

  .review-comment {
    font-size: 16px;
    color: #374151;
    line-height: 1.5;
  }

  /* Responsive Design */
  @media (max-width: 640px) {
    .reviews-container {
      padding: 16px;
    }

    h2 {
      font-size: 20px;
    }

    .review-form,
    .review {
      padding: 16px;
    }

    .submit-btn {
      width: 100%;
      padding: 10px;
      font-size: 14px;
    }

    .star {
      font-size: 20px;
    }

    textarea {
      font-size: 14px;
      padding: 10px;
    }

    .review-rating {
      font-size: 16px;
    }

    .review-meta {
      font-size: 12px;
    }

    .review-comment {
      font-size: 14px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .reviews-container {
      padding: 20px;
    }

    h2 {
      font-size: 22px;
    }

    .review-form,
    .review {
      padding: 20px;
    }

    .submit-btn {
      padding: 10px 20px;
      font-size: 15px;
    }
  }
</style>