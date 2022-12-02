<template>
  <div class="mr-2 ml-2">
    <b-table
        striped bordered hover
        ref="table"
        caption-top
        :items="getGrades"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        @row-clicked="editGrade"
        small
    >
      <template v-slot:table-caption>
        <b-row>
          <b-col sm="11">
            <h3 style="text-align:  center; color: black">Классы</h3>
          </b-col>
          <b-col sm="1" align="right">
            <b-button @click="createGrade">Создать</b-button>
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
      <b-modal v-model="showEditor" :title="grade.id !== null ? 'Обновить текущий класс' : 'Создать новый класс'"
               size="lg" @ok="saveGrade">

        <b-row class="mt-2">
          <b-col sm="3">
            <label for="grade">Класс</label>
          </b-col>
          <b-col sm="9">
            <b-form-select id="grade" v-model="grade.grade" :options="grades"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="letter">Литера: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="grade.letter"
                          id="letter"
                          type="text"
                          required
                          :state="checkUnique()"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>{{invalidMessage}}</b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import api from "@/API";

export default {
  name: "GradeList",
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
          key: 'grade',
          label: 'Класс',
        },
        {
          key: 'letter',
          label: 'Литера',
        },
        {
          key: 'actions',
          label: 'Удалить',
          class: 'text-center'
        },
      ],
      grade: {
        id: null,
        grade: null,
        letter: 'А'
      },
      showEditor: false,
      grades: [
        {
          text: 'Выберите класс',
          value: null
        },
        {
          text: 1,
          value: 'FIRST'
        },
        {
          text: 2,
          value: 'SECOND'
        },
        {
          text: 3,
          value: 'THIRD'
        },
        {
          text: 4,
          value: 'FOURTH'
        },
        {
          text: 5,
          value: 'FIFTH'
        },
        {
          text: 6,
          value: 'SIXTH'
        },
        {
          text: 7,
          value: 'SEVENTH'
        },
        {
          text: 8,
          value: 'EIGHTH'
        },
        {
          text: 9,
          value: 'NINTH'
        },
        {
          text: 10,
          value: 'TENS'
        },
        {
          text: 11,
          value: 'ELEVENTH'
        }
      ],
      allGrades: [],
      invalidMessage: ''
    }
  },

  created() {
    this.getAllClasses();
  },

  methods: {
    getAllClasses() {
      this.axios.get(api.v1.grades.getList(0, 500), {})
          .then(response => {
            this.allGrades = response.data.grades;
          });
    },

    getGrades(ctx, callback) {
      this.axios.get(api.v1.grades.getList(ctx.currentPage - 1, ctx.perPage), {})
          .then(response => {
            this.totalElements = response.data.page.total_elements || 0;
            let grades = response.data.grades || [];
            callback(grades);
          });
    },

    editGrade(grade) {
      this.grade = {
        id: grade.id,
        grade: grade.grade,
        letter: grade.letter
      }
      this.showEditor = true;
    },

    createGrade() {
      this.grade = {
        id: null,
        grade: null,
        letter: 'А'
      };
      this.showEditor = true;
    },

    saveGrade() {
      if (this.grade.id === null) {
        this.create();
      } else {
        this.update();
      }
    },

    create() {
      this.axios.post(api.v1.grades.create, this.grade, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Класс с id = ' + response.data.id + ' успешно создан.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Ошибка при создании', error.response.data.message, 'error');
      });
    },

    update() {
      this.axios.put(api.v1.grades.update(this.grade.id), this.grade, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Класс с id = ' + response.data.id + ' успешно обновлен.', 'info');
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
              this.deleteGrade(id);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },

    deleteGrade(id) {
      this.axios.delete(api.v1.grades.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Класс с id = ' + id + ' успешно удален.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Невозможно удалить', error.response.data.message, 'error');
      });
    },

    checkUnique() {
      if (this.grade.letter.length === 0) {
        this.invalidMessage = 'Литера должна быть задана';
        return false;
      } else if (this.grade.letter.length > 1) {
        this.invalidMessage = 'Литера состоять из одного символа';
        return false;
      }
      const result = this.allGrades.filter(grade => grade.grade === this.grade.grade && grade.letter === this.grade.letter);
      if (result.length > 0) {
        if (result[0].id === this.grade.id) {
          return true;
        } else {
          this.invalidMessage = 'Класс + литера должны быть уникальны';
          return false;
        }
      } else {
        this.invalidMessage = '';
        return true;
      }
    }

  }
}
</script>

<style scoped>

</style>
