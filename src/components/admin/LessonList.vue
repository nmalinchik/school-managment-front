<template>
  <div class="mr-2 ml-2">
    <b-table
        striped bordered hover
        ref="table"
        caption-top
        :items="getLessons"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        @row-clicked="editLesson"
        small
    >
      <template v-slot:table-caption>
        <b-row>
          <b-col sm="11">
            <h3 style="text-align:  center; color: black">Предметы</h3>
          </b-col>
          <b-col sm="1" align="right">
            <b-button @click="createLesson">Создать</b-button>
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
      <b-modal v-model="showEditor" :title="lesson.id !== null ? 'Обновить текущий предмет' : 'Создать новый предмет'"
               size="lg" @ok="saveLesson">
        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="title">Название: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="lesson.title"
                          id="title"
                          type="text"
                          required
                          :state="checkUnique()"
                          trim
            ></b-form-input>
            <b-form-invalid-feedback>{{feedbackMessage}}</b-form-invalid-feedback>
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col sm="3" align="left" class="pt-2">
            <label for="description">Описание: </label>
          </b-col>
          <b-col sm="9" align="left">
            <b-form-input v-model="lesson.description"
                          id="description"
                          type="text"
                          trim
            ></b-form-input>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import api from "@/API";

export default {
  name: "LessonList",
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
          label: 'Название',
        },
        {
          key: 'description',
          label: 'Описание',
        },
        {
          key: 'actions',
          label: 'Удалить',
          class: 'text-center'
        },
      ],
      lesson: {
        id: null,
        title: '',
        description: ''
      },
      showEditor: false,
      allLessons: [],
      feedbackMessage: ''
    }
  },

  created() {
    this.getAllLessons();
  },

  methods: {
    getLessons(ctx, callback) {
      this.axios.get(api.v1.lessons.getList(ctx.currentPage - 1, ctx.perPage), {})
          .then(response => {
            this.totalElements = response.data.page.total_elements || 0;
            let lessons = response.data.lessons || [];
            callback(lessons);
          });
    },

    getAllLessons() {
      this.axios.get(api.v1.lessons.getList(0, 500), {})
          .then(response => {
            this.allLessons = response.data.lessons;
          });
    },

    editLesson(lesson) {
      this.lesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description
      }
      this.showEditor = true;
    },

    createLesson() {
      this.lesson = {
        id: null,
        title: '',
        description: ''
      };
      this.showEditor = true;
    },

    saveLesson() {
      if (this.lesson.id === null) {
        this.create();
      } else {
        this.update();
      }
    },

    create() {
      this.axios.post(api.v1.lessons.create, this.lesson, {
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
      this.axios.put(api.v1.lessons.update(this.lesson.id), this.lesson, {
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
              this.deleteLesson(id);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },

    deleteLesson(id) {
      this.axios.delete(api.v1.lessons.delete(id), {
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

    checkUnique() {
      if (this.lesson.title.length < 3) {
        this.feedbackMessage = 'Название должно быть не меньше 3х символов.'
        return false;
      }
      const result = this.allLessons.filter(lesson => lesson.title === this.lesson.title);
      if (result.length > 0) {
        if (result[0].id === this.lesson.id) {
          return true;
        } else {
          this.feedbackMessage = 'Название должно быть уникальным.'
          return false;
        }
      } else {
        return true;
      }
    }
  }

}
</script>

<style scoped>

</style>
