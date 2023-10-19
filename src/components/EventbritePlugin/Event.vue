<template>
  <div class="event">
    <img :src="event.logo ? event.logo.original.url : null" :alt="`${event.name.text} ${event.id}`" width="56" height="56">
    <div>
      <p>
        <strong>{{ event.name.text }}</strong><br/>
      </p>
      <span>
        {{ event.start.timezone }} | {{ event.start.local }} 
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles.css'

defineProps({
  event: {
    type: Object,
    default: null,
  },
});
</script>