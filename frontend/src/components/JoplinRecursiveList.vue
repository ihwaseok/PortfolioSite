<template>
<li v-for="(item) in props.menuList" v-bind:key="item.ID">
    <a href="#" class="menu-item" v-on:click="getSubMenuList"  v-on:dblclick="openChildList" v-bind="{menuId: item.ID}">
		
		<ArrowIcon class="menu-arrow" v-if="item.CHILD_MENU != undefined" v-on:click="openChildList"/>
		{{ item.NAME }}
	</a>

	<ul class="menu-item-sub list-unstyled" v-if="item.CHILD_MENU != undefined">
		<JoplinRecursiveList v-bind:menuList="item.CHILD_MENU" v-bind:onGetMenuId="getMenuId"/>
	</ul>
</li>
</template>


<script setup lang="ts">
import type { MenuData } from '../custom/customType'
import ArrowIcon from '../assets/icon/angle-right-solid.vue'


const props = defineProps<{
    menuList: MenuData[];
}>()

const emit = defineEmits<{
	(e: 'getMenuId', menuId: string): void
}>()

// 서브 메뉴 리스트 출력
// 메뉴를 선택했을 경우 메뉴 Id를 JoplinMenu 에게 전달 (Emit)
function getSubMenuList (evt: Event): void {
	const el: Partial<HTMLElement> = evt!.target!;
	let menuId: string = el.getAttribute!('menuId')!;

	emit('getMenuId', menuId);

	evt.preventDefault(); // 상단이동 방지
}

// 하위 트리 활성화
// 화살표를 선택했을 경우 하위 리스트를 출력하고 화살표 애니메이션을 작동하기 위해 class를 조작
function openChildList (evt: Event): void {
    let el: Partial<HTMLElement> = evt!.target!;
	
	if (el.getAttribute!('menuId') == null) {
		el = el.parentElement!;
	}

    if (el.nextElementSibling != null) {
        const ul: Element = el.nextElementSibling;

        if (ul.classList.contains('menu-activated')) {
            ul.classList.remove('menu-activated');
			el.firstElementChild!.classList.remove('rotated');
        }
        else {
            ul.classList.add('menu-activated');
			el.firstElementChild!.classList.add('rotated');
        }
    }

	evt.preventDefault();
}

// 재귀 호출시 메뉴 Id 가져오기 (Emit-Receive)
function getMenuId(menuId: string): void {
	emit('getMenuId', menuId);
}

</script>


<style scoped>
.menu-item {
	display: block;
	color:black;
	padding: 0 0.625rem 0 0.4rem;
	margin: 0;
	font-weight: 500;
	text-decoration: none;
	line-height: 1.875rem;
}
.menu-item:hover {
	color:blue;
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
	float: right;
}
.rotated {
	transform: rotate(90deg);
}
</style>