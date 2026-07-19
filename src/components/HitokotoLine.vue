<script setup>
import { onMounted, ref } from 'vue'

const sentence = ref('成熟的人眼里满是前途，稚嫩的人眼里满是爱恨情仇。')

async function loadHitokoto() {
  try {
    const response = await fetch('https://v1.hitokoto.cn/?encode=json&c=d&c=i')
    const data = await response.json()
    sentence.value = data.hitokoto || sentence.value
  } catch {
    sentence.value = '成熟的人眼里满是前途，稚嫩的人眼里满是爱恨情仇。'
  }
}

onMounted(() => {
  loadHitokoto()
})
</script>

<template>
  <p class="hitokoto-line">{{ sentence }}</p>
</template>


