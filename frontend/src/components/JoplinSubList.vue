<template>
<span class="menu-title">
	<a>{{ menuName }}</a>
</span>

<li v-for="(item) in props.menuList" v-bind:key="item.MENU_ID">
    <a href="#" class="menu-item" v-bind:class="{active : (selectedId == item.MENU_ID)}" v-on:click="[subMenuSelect($event), passId(item.MENU_ID)]" v-bind="{menuPath: item.PATH}">
		{{ item.MENU_NM }}
	</a>
</li>
</template>


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { MenuData } from '../custom/customType';


let selectedId: Ref<string> = ref('');

const props = defineProps<{
	menuName: string;
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

// 메뉴 클릭 이벤트
// 메뉴 ID를 selectedId 에게 넘겨서 class 변경
function passId(id: string): void {
	selectedId.value = id;
}

</script>


<style scoped>
.menu-title {
	display: block;
	font-size: 18px;
	text-align: center;
	padding-bottom: 0.2rem;
	border-bottom: 2px solid black;
	background-color: #40BFFF;
	min-height: 2rem;
}
.menu-item {
	display: block;
	color:black;
	padding: 0 0.625rem 0 0.8rem;
	margin: 0;
	font-weight: 500;
	text-decoration: none;
	line-height: 1.875rem;
	border-bottom: 1px solid black;
}
.menu-item:hover {
	color: blue;
}

.active {
	background-color: #ACCEE5;
}
</style>