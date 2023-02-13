<template>
<li v-for="(item) in props.menuList" v-bind:key="item.ID">
    <a href="#" class="menu-item" v-on:click="subMenuSelect" v-bind="{menuPath: item.PATH}">
		{{ item.NAME }}
	</a>
</li>
</template>


<script setup lang="ts">
import type { MenuData } from '../custom/customType'


const props = defineProps<{
    menuList: MenuData[];
}>()

const emit = defineEmits<{
	(e: 'getMenuPath', menuId: string): void
}>()

// 메뉴 클릭 이벤트
// 메뉴 Path를 JoplinMenu 에게 전달 (Emit)
function subMenuSelect (evt: Event): void {
    const el: Partial<HTMLElement> = evt!.target!;
	let menuPath: string = el.getAttribute!('menuPath')!;

	emit('getMenuPath', menuPath);
}

</script>


<style scoped>
.menu-item {
	display: block;
	color:black;
	padding: 0 0.625rem 0 0.8rem;
	margin: 0;
	font-weight: 500;
	text-decoration: none;
	line-height: 1.875rem;
}
</style>