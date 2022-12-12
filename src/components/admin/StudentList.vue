<template>
  <div class="mr-2 ml-2">
    <b-table
        striped bordered hover
        ref="table"
        caption-top
        :items="getStudents"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        @row-clicked="editStudent"
        small
    >
      <template v-slot:table-caption>
        <b-row>
          <b-col sm="11">
            <h3 style="text-align:  center; color: black">Ученики</h3>
          </b-col>
          <b-col sm="1" align="right">
            <b-button @click="createStudent">Создать</b-button>
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
      <b-modal v-model="showEditor" :title="student.id !== null ? 'Обновить данные ученика' : 'Создать новую запись'"
               size="lg" @ok="saveStudent">
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="lastName">Фамилия: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="student.lastName"
                          id="lastName"
                          type="text"
                          required
                          :state="titleLength(student.lastName, 1)"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>Не меньше 2 символов</b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="firstName">Имя: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="student.firstName"
                          id="firstName"
                          type="text"
                          required
                          :state="titleLength(student.firstName, 1)"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>Не меньше 2 символов</b-form-invalid-feedback>
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="middleName">Отчество: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="student.middleName"
                          id="middleName"
                          type="text"
                          trim
            ></b-form-input>
          </b-col>
        </b-row>

        <!--        Дата рождения-->
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="dateOfBirth">Дата рождения: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-datepicker id="dateOfBirth"
                               v-model="student.dateOfBirth"
                               class="mb-2"
                               locale="ru-RU"
                               right
                               :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                               :min="getDate(20)"
                               :max="getDate(6)">
            </b-form-datepicker>
          </b-col>
        </b-row>

        <!--        Класс-->
        <b-row class="mt-2">
          <b-col sm="3">
            <label for="gradeId">Класс</label>
          </b-col>
          <b-col sm="9">
            <b-form-select id="position" v-model="student.gradeId" :options="allGrades"></b-form-select>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import api from "@/API";

export default {
  name: "StudentList",
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
          key: 'lastName',
          label: 'Фамилия',
        },
        {
          key: 'firstName',
          label: 'Имя',
        },
        {
          key: 'middleName',
          label: 'Отчество',
        },
        {
          key: 'dateOfBirth',
          label: 'Дата рождения',
        },
        {
          key: 'grade',
          label: 'Класс',
          formatter: value => this.gradesMap.get(value.grade) + ' "' + value.letter + '"'
        },
        {
          key: 'actions',
          label: 'Удалить',
          class: 'text-center'
        },
      ],
      student: {
        id: null,
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gradeId: null
      },
      gradesMap: null,
      showEditor: false,
      allGrades: [
        {
          text: 'Выберите класс',
          value: null
        },
      ]
    }
  },

  created() {
    this.gradesMap = new Map();
    this.gradesMap.set('FIRST', 1);
    this.gradesMap.set('SECOND', 2);
    this.gradesMap.set('THIRD', 3);
    this.gradesMap.set('FOURTH', 4);
    this.gradesMap.set('FIFTH', 5);
    this.gradesMap.set('SIXTH', 6);
    this.gradesMap.set('SEVENTH', 7);
    this.gradesMap.set('EIGHTH', 8);
    this.gradesMap.set('NINTH', 9);
    this.gradesMap.set('TENS', 10);
    this.gradesMap.set('ELEVENTH', 11);
    this.getAllGrades();
  },

  methods: {
    getAllGrades() {
      this.axios.get(api.v1.grades.getList(0, 500), {})
          .then(response => {
            let grades = [];
            response.data.grades.forEach(grade => grades.push(
                {
                  id: grade.id,
                  grade: this.gradesMap.get(grade.grade),
                  letter: grade.letter
                }
            ));
            grades = grades.sort((a, b) => a.grade - b.grade || a.letter.localeCompare(b.letter));
            grades.forEach(grade => this.allGrades.push(
                {
                  text: grade.grade + ' "' + grade.letter + '"',
                  value: grade.id
                },
            ))
            console.log(this.allGraes);
          });
    },


    getStudents(ctx, callback) {
      this.axios.get(api.v1.students.getList(ctx.currentPage - 1, ctx.perPage), {})
          .then(response => {
            this.totalElements = response.data.page.total_elements || 0;
            let students = response.data.students || [];
            callback(students);
          });
    },

    editStudent(student) {
      console.log(student);
      this.student = {
        id: student.id,
        lastName: student.lastName,
        firstName: student.firstName,
        middleName: student.middleName,
        dateOfBirth: student.dateOfBirth,
        gradeId: student.grade.id
      }
      this.showEditor = true;
    },

    createStudent() {
      this.student = {
        id: null,
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gradeId: null
      };
      this.showEditor = true;
    },

    saveStudent() {
      if (this.student.id === null) {
        this.create();
      } else {
        this.update();
      }
    },

    create() {
      this.axios.post(api.v1.students.create, this.student, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Предмет с id = ' + response.data.id + ' успешно создан.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Ошибка при создании', error.response.data.message, 'error');
      });
    },

    update() {
      this.axios.put(api.v1.students.update(this.student.id), this.student, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Предмет с id = ' + response.data.id + ' успешно обновлен.', 'info');
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
              this.deleteStudent(id);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },

    deleteStudent(id) {
      this.axios.delete(api.v1.students.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          this.$swal('Успешно', 'Предмет с id = ' + id + ' успешно удален.', 'info');
        }
        this.$refs.table.refresh();
      }).catch(error => {
        this.$swal('Невозможно удалить', error.response.data.message, 'error');
      });
    },

    titleLength(value, length) {
      return value.length > length;
    },

    getDate(years) {
      let date = new Date();
      date.setFullYear(date.getFullYear() - years);
      return date.toISOString().split('T')[0];
    }
  }
  }
</script>

<style scoped>

</style>
