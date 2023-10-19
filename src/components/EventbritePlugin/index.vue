<script setup lang="ts">
import './styles.css'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import Modal from './Modal.vue';
import Event from './Event.vue';

const { data, actions } = useFieldPlugin();

const selectEvent = (event: any) => {
  console.log(event);

  const newContent = {
    ...Object(data.content),
    event: event,
  };

  actions.setContent(newContent);
  actions.setModalOpen(false);
};
</script>

<template>
  <!-- Modal -->
  <Modal v-if="data.isModalOpen" @select-event="selectEvent"></Modal>

  <!-- Metabox -->
  <div v-else class="container">
    <button
      class="btn w-full"
      type="button"
      @click="() => actions.setModalOpen(true)"
    >
      Open modal
    </button>

    <!-- TODO: should not cast to any -> define own types lib -->
    <Event v-if="(data.content as any)?.event" :event="(data.content as any)?.event" />
  </div>
</template>
