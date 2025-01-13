<template>
	<div class="text-center">
		<v-btn color="primary" class="ma-2" rounded disabled>{{ menuName }}</v-btn>
	</div>

	<v-list density="compact" nav v-for="(item) in props.menuList" v-bind:key="item.MENU_ID">
		<v-list-item :active="(selectedId == item.MENU_ID)" v-on:click="[subMenuSelect(item.PATH), passId(item.MENU_ID)]">
			{{ item.MENU_NM }}
		</v-list-item>
	</v-list>
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
function subMenuSelect(menuPath: string): void {
	emit('getMenuPath', menuPath);
}

// 메뉴 클릭 이벤트
// 메뉴 ID를 selectedId 에게 넘겨서 class 변경
function passId(id: string): void {
	selectedId.value = id;
}

</script>