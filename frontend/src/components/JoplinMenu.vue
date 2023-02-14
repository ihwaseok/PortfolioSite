<template>
<div class="d-flex wrapper wrapper-navbar-used wrapper-navbar-fixed">

	<!-- Main Menu -->
	<nav role="navigation" id="navigation" class="sidebar sidebar-rounded-top-right">

		<!-- sidebar -->
		<div class="sidebar-menu">

			<!-- menu fixed -->
			<div class="sidebar-menu-fixed sidebar-bg-light">

				<!-- menu scrollbar -->
				<div class="scrollbar scrollbar-use-navbar">

					<!-- menu -->
					<ul class="list list-unstyled mb-0">

						<JoplinRecursiveList v-if="mainMenuList.length > 0" v-bind:menuList="mainMenuList" v-bind:onGetMenuId="getMenuId"/>

					</ul>

				</div>

			</div>

		</div>

	</nav>
	
	<!-- Sub Menu -->
	<nav role="navigation" id="navigation" class="sidebar sidebar-rounded-top-right">

		<!-- sidebar -->
		<div class="sidebar-menu">

			<!-- menu fixed -->
			<div class="sidebar-menu-fixed sidebar-bg-blue">

				<!-- menu scrollbar -->
				<div class="scrollbar scrollbar-use-navbar">

					<!-- menu -->
					<ul class="list list-unstyled mb-0">

						<JoplinSubList v-bind:menuList="subMenuList" v-bind:onGetMenuPath="getMenuPath"/>

					</ul>

				</div>

			</div>

		</div>

	</nav>

</div>
</template>


<script lang="ts">
import axios, { type AxiosResponse } from 'axios';
import JoplinRecursiveList from './JoplinRecursiveList.vue';
import JoplinSubList from './JoplinSubList.vue';
import type { MenuData } from '../custom/customType'


export default {
	components: {
		JoplinRecursiveList,
		JoplinSubList
	},
	data() {
		return {
			mainMenuList: [] as MenuData[],
			subMenuList: [] as MenuData[]
		};
	},
	mounted() {
		this.getMenuList();
	},
	methods: {
		// DB로 부터 메뉴 리스트 가져오기
		getMenuList (): void {
			axios.get('/joplin/menu/r', {params: {id: 'all'}})
				.then((res: AxiosResponse) => {
					this.mainMenuList = this.convertMainMenuData(res.data);
				});
		},

		// 메뉴 리스트를 JoplinRecursiveList 에서 구성하기 위한 형식으로 변환
		// 최하단에서 부터 위로 올라오며 처리 (DB에서 받아오는 데이터는 정렬되어 있다)
		convertMainMenuData (menuList: MenuData[]): MenuData[] {
			let mainMenuList: MenuData[] = [];

			for (let i: number = menuList.length-1; i >= 0; i--) {
				if (menuList[i].CHILD_MENU_ID != null && menuList[i].CHILD_MENU_ID != undefined) {
					let childMenuId: string[] = menuList[i].CHILD_MENU_ID.split(',');
					let childMenuList: MenuData[] = [];

					for (let j: number = menuList.length-1; j >= i; j--) {	
						if (childMenuId.includes(menuList[j].ID)) {
							childMenuList.push(menuList[j]);
						}
					}

					childMenuList.sort(this.menuSortStandard);
					menuList[i].CHILD_MENU = childMenuList;
				}
				
				if (menuList[i].PARENT_ID == null || menuList[i].PARENT_ID == undefined) {
					mainMenuList.push(menuList[i]);
				}
			}

			mainMenuList.sort(this.menuSortStandard);
			return mainMenuList;
		},

		// 메뉴 리스트 정렬기준
		menuSortStandard (a: MenuData, b: MenuData) {
			if (a == null || b == null)
				return 1;
			if (a.SORT_NO > b.SORT_NO)
				return 1;
				
			return 1;
		},

		// JoplinRecursiveList 에서 클릭한 메뉴의 Id를 받아오기 (Emit-Receive)
		getMenuId (menuId: string): void {
			this.getSubMenuList(menuId);
		},

		// 받아온 메뉴 Id로 서브 메뉴 리스트 가져오기
		getSubMenuList (menuId: string) {
			axios.get('/joplin/menu/r', {params: {id: menuId}})
				.then((res: AxiosResponse) => {
					this.subMenuList = res.data;
				});
		},

		// JoplinSubList 에서 클릭한 메뉴의 Path를 받아와서 App 으로 전달 (Emit, Emit-Receive)
		getMenuPath (menuPath: string): void {
			this.$emit('getMenuPath', menuPath);
		}
	}
}
</script>


<style scoped>
.wrapper {
	min-height: 100vh;
}
.wrapper-navbar-used {
	min-height: calc(100vh - 3.5rem);
}
.wrapper-navbar-fixed {
	margin-top: 0rem;
}
.sidebar {
  margin-left: -14.375rem;
  transition: margin 0.15s ease-out;
}
@media (min-width: 768px) {
  .sidebar {
    margin-left: 0;
  }
}
.sidebar-rounded-top-right {
  border-top-right-radius: 0.25rem;
}
.sidebar-menu {
  width: 14.375rem;
}
.sidebar-menu-fixed {
  position: fixed;
}
.sidebar-bg-light {
	background-color: #f8f9fa;
}
.sidebar-bg-blue {
	background-color: #9bc3fe;
}
.scrollbar {
  width: 14.375rem;
  overflow: hidden;
  position: relative;
}
.scrollbar-use-navbar {
  height: calc(100vh - 3.5rem);
}
.list {
  width: 14.375rem;
  font-size: 0.875rem;
  margin-left: 0rem;
}
</style>