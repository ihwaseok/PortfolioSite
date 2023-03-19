export type MenuData = {
    MENU_ID: string,
    MENU_NM: string,
    PARENT_ID: string,
    PATH: string,
    SORT_NO: number,
    IS_DIR: string,
    CHILD_MENU_ID: string,
	CHILD_MENU: MenuData[],
    SUB_CNT: number
}

export type ADMIN_MENU = {
    MENU_ID: string,
    MENU_NM: string,
    PARENT_ID: string,
    CATEGORY: string,
    PATH: string,
    IS_DIR: string,
    SORT_NO: number,
    CREATED_AT: string
}

export type ADMIN_BOARD = {
    CATEGORY: string,
    BOARD_ID: number,
    TITLE: string,
    CONTENT: string,
    CREATED_BY: string,
    CREATED_AT: string,
    DELETE_YN: string
}