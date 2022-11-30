<template>
  <div>
    <div class="mr-2 ml-2">
      <b-table
          striped bordered hover
          ref="table"
          caption-top
          :items="getEmployees"
          :fields="tableFields"
          :current-page="currentPage"
          :per-page="perPage"
          @row-clicked="editEmployee"
          small
      >
        <template v-slot:table-caption>
          <b-row>
            <b-col sm="11">
              <h3 style="text-align:  center; color: black">Сотрудники</h3>
            </b-col>
            <b-col sm="1" align="right">
              <b-button @click="createEmployee">Создать</b-button>
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
    </div>
<!--    modals-->
    <div>
      <b-modal v-model="showEditor" :title="employee.id !== null ? 'Обновить текущего сотрудника' : 'Создать нового сотрудника'"
               size="lg" @ok="saveEmployee">

<!--        Фамилия-->
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="lastName">Фамилия: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="employee.lastName"
                          id="lastName"
                          type="text"
                          required
                          :state="titleLength(employee.lastName, 1)"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>Фамилия должна состоять минимум из 2х символов</b-form-invalid-feedback>
          </b-col>
        </b-row>

        <!--        Имя-->
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="firstName">Имя: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="employee.firstName"
                          id="firstName"
                          type="text"
                          required
                          :state="titleLength(employee.firstName, 1)"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>Имя должно состоять минимум из 2х символов</b-form-invalid-feedback>
          </b-col>
        </b-row>

        <!--        Отчество-->
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="middleName">Отчество(если есть): </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="employee.middleName"
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
                               v-model="employee.dateOfBirth"
                               class="mb-2"
                               locale="ru-RU"
                               right
                               :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                               :min="getDate(80)"
                               :max="getDate(18)">
            </b-form-datepicker>
          </b-col>
        </b-row>

<!--        Должность-->
        <b-row class="mt-2">
          <b-col sm="3">
            <label for="position">Должность</label>
          </b-col>
          <b-col sm="9">
            <b-form-select id="position" v-model="employee.positionId" :options="positions"></b-form-select>
          </b-col>
        </b-row>
        <!--     Доп   Должность-->
        <b-row class="mt-2">
          <b-col sm="3">
            <label for="extraPosition">Дополнительная должность</label>
          </b-col>
          <b-col sm="9">
            <b-form-select id="extraPosition" v-model="employee.extraPositionId" :options="positions"></b-form-select>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import api from "../../API"
export default {
  name: "EmployeeList",
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
          key: 'position.title',
          label: 'Должность ',
        },
        {
          key: 'actions',
          label: 'Удалить',
          class: 'text-center'
        },
      ],
      employee: {
        id: null,
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        positionId: null,
        extraPositionId: null
      },
      showEditor: false,

      positions: [
        {
          text: 'Выберите должность',
          value: null
        }
      ]
    }
  },

  created() {
    this.getPositions();
  },

  methods: {
    getEmployees(ctx, callback) {
      this.axios.get(api.v1.employees.getList(ctx.currentPage - 1, ctx.perPage), {})
          .then(response => {
            this.totalElements = response.data.page.total_elements || 0;
            let employees = response.data.employees || [];
            callback(employees);
          });
    },

    getPositions() {
      this.axios.get(api.v1.positions.getList(0, 100), {})
          .then(response => {
            response.data.positions.forEach(position => {
              this.positions.push({
                text: position.title,
                value: position.id
              })
            })
          });
    },

    createEmployee() {
      this.employee = {
        id: null,
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        positionId: null,
        extraPositionId: null
      };
      this.showEditor = true;
    },

    editEmployee(employee) {

      this.employee = {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        dateOfBirth: employee.dateOfBirth,
        positionId: employee.position.id,
        extraPositionId: employee.extraPosition !== null ? employee.extraPosition.id : null
      };
      this.showEditor = true;
    },

    saveEmployee() {
      if (this.employee.id !== null) {
        this.update();
      } else {
        this.create();
      }
    },

    create() {
      this.axios.post(api.v1.employees.create, this.employee, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log(response);
        this.$refs.table.refresh();
      });
    },

    update() {
      this.axios.put(api.v1.employees.update(this.employee.id), this.employee, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log(response);
        this.$refs.table.refresh();
      });
    },

    openDeleteModal(id) {
      this.$bvModal.msgBoxConfirm('Вы уверены?')
          .then(value => {
            if (value === true) {
              this.deleteEmployee(id);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },

    deleteEmployee(id) {
      this.axios.delete(api.v1.employees.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log(response);
        this.$refs.table.refresh();
      });
    },

    //---------------------------------------------------------------------------
    //STATES
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
