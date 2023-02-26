<template>
<table>
    <thead>
        <th v-for="(head) in header">{{ head }}</th>
    </thead>

    <tbody>
        <tr v-for="(line) in tableData">
            <td v-for="(data) in line">{{ data }}</td>
        </tr>
    </tbody>
</table>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, watch } from 'vue'


const props = defineProps<{
    header: string[];
    headerMatcher: string[];
    dataList: object[];
}>()

let tableData: Ref<(string | number | null | undefined)[][]> = ref([]);

// 데이터 리스트 변환 메소드
// 데이터를 headerMatcher 순서대로 추출한다
function convertData (headerMatcher: string[], dataList: object[]): void {
    let convertedList: (string | number | null | undefined)[][] = [];

    if (dataList != null && dataList != undefined) {
        let convertedData: (string | number | null | undefined)[] = [];
        type dataKey = keyof typeof dataList[0];
        
        for (let data of dataList) {
            convertedData = [];

            for (let header of headerMatcher) {
                convertedData.push(data[header as dataKey])
            }
            
            convertedList.push(convertedData);
        }
    }
    
    tableData.value = convertedList;
}

convertData(props.headerMatcher, props.dataList);

watch(() => props.dataList, (newValue, oldValue) => {
    convertData(props.headerMatcher, props.dataList);
})

</script>