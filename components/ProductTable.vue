<template>
  <div class="products-container">
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Пошук..."
        class="search-input"
    />

    <table class="products-table">
      <thead class="table-header">
      <tr>
        <th
            v-for="(label, field) in columns"
            :key="field"
            @click="toggleSort(field)"
            class="table-header-cell"
        >
          <span>{{ label }}</span>
          <span v-if="sortField === field">
              {{ sortAsc ? "▲" : "▼" }}
            </span>
        </th>
        <th class="image-header">Фото</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="product in paginatedProducts"
          :key="product.id"
          class="table-row"
      >
        <td class="product-cell">{{ product.title }}</td>
        <td class="product-cell">{{ product.description }}</td>
        <td class="product-cell">${{ product.price }}</td>
        <td
            class="product-cell rating"
            :class="product.rating < 4.5 ? 'low-rating' : 'high-rating'"
        >
          {{ product.rating }}
        </td>
        <td class="product-cell">{{ product.brand }}</td>
        <td class="product-cell">{{ product.category }}</td>
        <td class="image-cell">
          <img
              :src="product.thumbnail"
              alt="thumb"
              class="product-image"
          />
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="pagination-button"
          :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const products = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 5;
const sortField = ref("");
const sortAsc = ref(true);

const columns = {
  title: "Назва",
  description: "Опис",
  price: "Ціна",
  rating: "Оцінка",
  brand: "Бренд",
  category: "Категорія",
};

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    products.value = data.products || [];
  } catch (error) {
    console.error("Помилка при завантаженні продуктів:", error);
  }
}

onMounted(() => {
  fetchProducts();
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter((product) =>
      Object.values(product).some((value) =>
          String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
});

const sortedProducts = computed(() => {
  if (!sortField.value) return filteredProducts.value;
  return [...filteredProducts.value].sort((a, b) => {
    const aVal = a[sortField.value];
    const bVal = b[sortField.value];
    return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return sortedProducts.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / perPage)
);

function toggleSort(field) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortField.value = field;
    sortAsc.value = true;
  }
  currentPage.value = 1;
}
</script>
