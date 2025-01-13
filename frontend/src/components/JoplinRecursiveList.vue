<template>
	<v-list class="menu-list" density="compact" nav v-for="(item) in props.menuList" v-bind:key="item.MENU_ID">
		<v-list-item class="menu-item" link :active="(selectedId == item.MENU_ID && 'N' == item.IS_DIR)" v-on:click="getSubMenuList(item.MENU_ID, item.MENU_NM)">
				{{ item.MENU_NM }} ({{ calculateNote(item, 0) }})
				<ArrowIcon v-bind:id="item.MENU_ID + '_arrow'" class="menu-arrow" v-if="item.IS_DIR == 'Y'"/>
		</v-list-item>

		<ul v-bind:id="item.MENU_ID + '_child'" class="menu-item-sub list-unstyled" v-if="item.CHILD_MENU != undefined">
			<JoplinRecursiveList v-bind:menuList="item.CHILD_MENU" v-bind:onGetMenuId="getMenuId"/>
		</ul>
	</v-list>
</template>


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { MenuData } from '../custom/customType';
import ArrowIcon from '../assets/icon/angle-right-solid.vue';

let selectedId: Ref<string> = ref('');

const props = defineProps<{
    menuList: MenuData[];
}>()

const emit = defineEmits<{
	(e: 'getMenuId', menuData: Partial<MenuData>): void
}>()

// 서브 메뉴 리스트 출력
// 메뉴를 선택했을 경우 메뉴 Id를 JoplinMenu 에게 전달 (Emit)
function getSubMenuList (menuId: string, menuName: string): void {
	const menuData: Partial<MenuData> = {MENU_ID: menuId, MENU_NM: menuName};

	selectedId.value = menuId;

	emit('getMenuId', menuData);
	openChildList(menuId);
}

// 하위 트리 활성화
// 화살표를 선택했을 경우 하위 리스트를 출력하고 화살표 애니메이션을 작동하기 위해 class를 조작
function openChildList (menuId: string): void {
	const arrow: Partial<HTMLElement> = document.getElementById(menuId + '_arrow')!;
	const child: Partial<HTMLElement> = document.getElementById(menuId + '_child')!;
	
    if (child != null) {
        if (child.classList!.contains('menu-activated')) {
            child.classList!.remove('menu-activated');
			arrow.classList!.remove('rotated');
        }
        else {
            child.classList!.add('menu-activated');
			arrow.classList!.add('rotated');
        }
    }
}

// 재귀 호출시 메뉴 Id 가져오기 (Emit-Receive)
function getMenuId(menuData: Partial<MenuData>): void {
	emit('getMenuId', menuData);
}

// 하위 트리를 포함한 노트의 개수 계산
function calculateNote (item: MenuData, count: number): number {
	count = count + item.SUB_CNT;

	if (item.CHILD_MENU != undefined) {
		for (let child of item.CHILD_MENU) {
			count = calculateNote(child, count);
		}
	}

	return count;
}

</script>


<style scoped>
.menu-list {
	padding-top: 0;
	padding-bottom: 0;
	padding-right:0;
}
.menu-item {
	padding: 0 0 0 0;
}
.menu-item:hover {
	color:gold;
}

.menu-item-sub {
	display: none;
	margin-left: 1rem;
}
.menu-activated {
    display: block;
}
.menu-arrow {
	font-family: "Font Awesome 5 Free", sans-serif;
	font-size: 0.8rem;
	font-weight: 900;
	margin-top: 0.6rem;
	margin-right: 0.3rem;
	fill:whitesmoke;
	float: right;
}
.rotated {
	transform: rotate(90deg);
}
.text-white {
	color: whitesmoke;
}
</style>