<template>
  <div class="ui-touch-slider" :style="{ top: this.top + 'vh' }">
    <div
      :class="[
        'ui-touch-slider__holder',
        {
          'ui-touch-slider__holder_hidden': this.top === this.fullScreenBreakpoint,
        },
      ]"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lowestBreakpoint: 80,
      averageBreakpoint: 50,
      fullScreenBreakpoint: 0,
      startY: 0,
      currentY: 0,
      top: 50,
      dragDirection: null,
    };
  },
  methods: {
    onTouchStart(e) {
      e.preventDefault();
      e.stopPropagation();
      this.startY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      e.preventDefault();
      e.stopPropagation();
      this.currentY = e.touches[0].clientY;
      const diff = ((this.startY - this.currentY) / window.innerHeight) * 100;
      this.top = Math.min(Math.max(this.top - diff, this.fullScreenBreakpoint), this.lowestBreakpoint);
      this.dragDirection = this.currentY - this.startY < 0 ? "top" : "bottom";
      this.startY = this.currentY;
    },
    onTouchEnd(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.dragDirection === "bottom") {
        if (this.top < this.averageBreakpoint) {
          this.top = this.averageBreakpoint;
        } else {
          this.top = this.lowestBreakpoint;
        }
      } else {
        if (this.top > this.averageBreakpoint) {
          this.top = this.averageBreakpoint;
        } else {
          this.top = this.fullScreenBreakpoint;
        }
      }
    },
  },
};
</script>

<style>
.ui-touch-slider {
  position: fixed;
  left: 0;
  right: 0;
  transition: top 0.3s ease-out;
}

.ui-touch-slider__holder {
  position: absolute;
  top: 8px;
  left: 50%;
  z-index: 20;
  transform: translateX(-50%);
  width: 40px;
  height: 5px;
  background-color: #bdbdbd;
  border-radius: 2.5px;
  cursor: grab;
  cursor: grab;
}

.ui-touch-slider__holder:active {
  cursor: grabbing;
}

.ui-touch-slider__holder_hidden {
  opacity: 0;
}
</style>
