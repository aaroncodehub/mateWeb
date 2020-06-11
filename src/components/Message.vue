<template>
    <v-container fluid>
      <v-layout wrap>

        <v-flex xs12>
          <v-combobox
            v-model="selectedProcess"
            :items="process"
            label="I use a scoped slot"
            multiple
            chips
          >
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                :selected="data.selected"
                :disabled="data.disabled"
                class="v-chip--select-multi"
                @input="data.parent.selectItem(data.item)"
              >
                <v-avatar
                  class="accent white--text"
                  v-text="data.item.slice(0, 1).toUpperCase()"
                ></v-avatar>
                {{ data.item }}
              </v-chip>
            </template>
          </v-combobox>
        </v-flex>

      </v-layout>
    </v-container>
</template>

<script>
  export default {
      name:'orderLines',
        data() {
            return {
        process:[
            'CU',
            'HO',
            'WA',
            'TO',
            'PA',
            'FM'
        ],
        selectedProcess: [],
        }
    }
  }
</script>