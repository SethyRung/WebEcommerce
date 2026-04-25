<script lang="ts" setup>
const props = defineProps<{
  game: Game;
}>();

const hasDiscount = computed(() => {
  // The current API doesn't return originalPrice/discountPercent yet,
  // but we'll prepare for when it does.
  return false;
});
</script>

<template>
  <NuxtLink :to="`/games/${game.id}`" class="group block">
    <UCard
      :ui="{
        root: 'overflow-hidden transition-transform hover:scale-[1.02]',
        body: 'p-0',
        footer: 'p-3',
      }"
    >
      <div class="relative aspect-460/215 bg-muted overflow-hidden">
        <img
          v-if="game.imageUrl"
          :src="game.imageUrl"
          :alt="game.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <UIcon name="i-lucide-image" class="text-muted size-12" />
        </div>

        <UBadge v-if="game.stock === 0" color="error" class="absolute top-2 left-2">
          Out of stock
        </UBadge>
      </div>

      <template #footer>
        <div class="space-y-1">
          <h3 class="font-semibold truncate group-hover:text-primary transition-colors">
            {{ game.name }}
          </h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold">${{ game.price }}</span>
              <span v-if="hasDiscount" class="text-sm text-muted line-through"
                >${{ game.originalPrice }}</span
              >
            </div>
            <UBadge v-if="game.category" color="neutral" variant="subtle" size="xs">
              {{ game.category }}
            </UBadge>
          </div>
        </div>
      </template>
    </UCard>
  </NuxtLink>
</template>
