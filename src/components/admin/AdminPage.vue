<template>
  <div>
    <div class="m-3">
      <b-card-group deck>
<!--        todo replace images-->
        <admin-card card-name="Сотрудники"
                    :description="descriptions[0]"
                    image-source="https://picsum.photos/600/300/?image=1"
                    panel-path="/admin/employees"></admin-card>
        <admin-card card-name="Должности"
                    :description="descriptions[1]"
                    image-source="https://picsum.photos/600/300/?image=50"
                    panel-path="/admin/positions"></admin-card>
        <admin-card card-name="Ученики"
                    :description="descriptions[2]"
                    image-source="https://picsum.photos/600/300/?image=20"
                    panel-path="/admin/students"></admin-card>
      </b-card-group>
      <b-card-group class="mt-5" deck>
        <admin-card card-name="Классы"
                    :description="descriptions[3]"
                    image-source="https://picsum.photos/600/300/?image=10"
                    panel-path="/admin/grades"></admin-card>
        <admin-card card-name="Предметы"
                    :description="descriptions[4]"
                    image-source="https://picsum.photos/600/300/?image=15"
                    panel-path="/admin/lessons"></admin-card>
        <admin-card card-name="Расписание"
                    :description="descriptions[5]"
                    image-source="https://picsum.photos/600/300/?image=66"
                    panel-path="/admin/timetable"></admin-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import AdminCard from "@/components/common/AdminCard";
export default {
  name: "AdminPage",
  components: {AdminCard},

  data() {
    return {
      descriptions: [
        "Создание и редактирование сотрудников учебного заведения",
        "Создание и редактирование должностей учебного заведения",
        "Создание и редактирование учеников учебного заведения",
        "Создание и редактирование классов учебного заведения",
        "Создание и редактирование уроков учебного заведения",
        "Создание и редактирование расписания учебного заведения"
      ],
    }
  }
}
</script>

<style scoped>

</style>
