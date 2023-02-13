export type MenuData = {
    ID: string,
    NAME: string,
    PARENT_ID: string,
    PATH: string,
    SORT_NO: number,
    IS_DIR: string,
    CHILD_MENU_ID: string,
	CHILD_MENU: MenuData[]
}