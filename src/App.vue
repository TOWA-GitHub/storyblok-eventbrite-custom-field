<script setup lang="ts">
import EventbritePlugin from './EventbritePlugin.vue'
import { FieldPluginProvider } from '@storyblok/field-plugin/vue3'
</script>

<template>
  <FieldPluginProvider>
    <template v-slot:isLoading>
      <span>Loading...</span>
    </template>
    <template v-slot:error>
      <span>Error</span>
    </template>

    <EventbritePlugin />
  </FieldPluginProvider>
</template>
