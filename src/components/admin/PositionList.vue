<template>
  <div class="mr-2 ml-2">
    <b-table
        striped bordered hover
        ref="table"
        caption-top
        :items="getPositions"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        @row-clicked="editPosition"
        small
    >
      <template v-slot:table-caption>
        <b-row>
          <b-col sm="11">
            <h3 style="text-align:  center; color: black">Должности</h3>
          </b-col>
          <b-col sm="1" align="right">
            <b-button @click="createPosition">Создать</b-button>
          </b-col>
        </b-row>
      </template>
      <template v-slot:cell(index)="data">
        {{(data.index + 1) + (currentPage - 1) * perPage}}
      </template>
      <template v-slot:cell(actions)="data">
        <b-link @click="openDeleteModal(data.item.id)">
          <b-badge pill variant="danger">
            <p class="m-1">Удалить</p>
          </b-badge>
        </b-link>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="totalElements" :per-page="perPage" align="center"></b-pagination>

    <div>
      <b-modal v-model="showEditor" :title="position.id !== null ? 'Обновить текущую должность' : 'Создать новую должность'"
               size="lg" @ok="savePosition">
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="title">Название: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="position.title"
                          id="title"
                          type="text"
                          required
                          :state="checkUnique()"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>Фамилия должна состоять минимум из 3х символов и быть уникальна</b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import api from "@/API";

export default {
  name: "PositionList",
  components: {},

  data() {
    return {
      perPage: 10,
      currentPage: 1,
      totalElements: 0,
      tableFields: [
        {
          key: 'index',
          label: '№',
        },
        {
          key: 'title',
          label: 'Должность',
        },
        {
          key: 'actions',
          label: 'Удалить',
          class: 'text-center'
        },
      ],
      position: {
        id: null,
        title: ''
      },
      showEditor: false,
      allPositions: []
    }
  },

  created() {
    this.getAllPositions();
  },

  methods: {
    getPositions(ctx, callback) {
      this.axios.get(api.v1.positions.getList(ctx.currentPage - 1, ctx.perPage), {})
          .then(response => {
            this.totalElements = response.data.page.total_elements || 0;
            let positions = response.data.positions || [];
            callback(positions);
          });
    },

    getAllPositions() {
      this.axios.get(api.v1.positions.getList(0, 500), {})
          .then(response => {
            this.allPositions = response.data.positions;
          });
    },

    editPosition(position) {
      this.position = {
        id: position.id,
        title: position.title
      }
      this.showEditor = true;
    },

    createPosition() {
      this.position = {
        id: null,
        title: ''
      };
      this.showEditor = true;
    },

    savePosition() {
      if (this.position.id === null) {
        this.create();
      } else {
        this.update();
      }
    },

    create() {
      this.axios.post(api.v1.positions.create, this.position, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Должность с id = ' + response.data.id + ' успешно создана.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Ошибка при создании', error.response.data.message, 'error');
      });
    },

    update() {
      this.axios.put(api.v1.positions.update(this.position.id), this.position, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Должность с id = ' + response.data.id + ' успешно обновлена.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Ошибка при обновлении', error.response.data.message, 'error');
      });
    },

    openDeleteModal(id) {
      this.$bvModal.msgBoxConfirm('Вы уверены?')
          .then(value => {
            if (value === true) {
              this.deletePosition(id);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },

    deletePosition(id) {
      this.axios.delete(api.v1.positions.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Должность с id = ' + id + ' успешно удалена.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Невозможно удалить', error.response.data.message, 'error');
      });
    },

    checkUnique() {
      if (this.position.title.length < 3) {
        return false;
      }
      const result = this.allPositions.filter(position => position.title === this.position.title);
      if (result.length > 0) {
        return result[0].id === this.position.id;
      } else {
        return true;
      }
    }
  }

}
</script>

<style scoped>

</style>
