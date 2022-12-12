<template>
  <div>
    <b-card
        :title="cardName"
        :img-src="imageSource"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
        @click="goToSelectCard"
    >
      <b-card-text>
        {{description}}
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "AdminCard",
  props: {
    cardName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    imageSource: {
      type: String,
      required: true,
    },
    panelPath: {
      type: String,
      required: true,
    }
  },

  methods: {
    goToSelectCard() {
      this.$router.push(this.panelPath);
    }
  }


}
</script>

<style scoped>

</style>
