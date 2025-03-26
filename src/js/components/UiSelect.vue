<template>
  <div
      class="ui fluid search selection dropdown"
      :class="{ 'active visible':showMenu, 'error': isError, 'disabled': isDisabled }"
      @click="openOptions"
      @focus="openOptions"
  >
    <i class="dropdown icon"></i>
    <input
        v-if="editable"
        class="search"
        autocomplete="off"
        :disabled="isDisabled"
        :tabindex="isDisabled ? -1 : 0"
        :id="id"
        :name="name"
        :value="searchText"
        @input="onInput"
        ref="input"
        @focus.prevent="openOptions"
        @keyup.esc="closeOptions"
        @blur="blurInput"
        @keydown.up="prevItem"
        @keydown.down="nextItem"
        @keydown.enter.prevent=""
        @keyup.enter.prevent="enterItem"
        @keydown.delete="deleteTextOrItem"
    />
    <div
        class="text"
        :class="textClass" :data-vss-custom-attr="searchTextCustomAttr"
    >{{ inputText }}
    </div>
    <div
        class="menu"
        ref="menu"
        @mousedown.prevent
        :class="menuClass"
        :style="menuStyle"
        tabindex="-1"
    >
      <div
          v-for="(option, idx) in filteredOptions"
          :key="idx"
          class="item"
          :class="{ 'selected': option.selected || pointer === idx, 'disabled': option.disabled }"
          :data-vss-custom-attr="customAttrs[idx] ? customAttrs[idx] : ''"
          @click.stop="selectItem(option)"
          @mousedown="mousedownItem"
          @mouseenter="pointerSet(idx)"
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script>

import {escapedRegExp} from "~/utils";

export default {
  name: "ui-select",
  emits: ["blur", "input"],
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Number, Object, Boolean],
    },
    customAttr: {
      type: Function,
      default: () => "",
    },
    options: {
      type: Array,
    },
    id: {
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    isError: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    filterPredicate: {
      type: Function,
      default: (text, inputText) => {
        return text.match(escapedRegExp(inputText))
      },
    },
  },
  data() {
    return {
      showMenu: false,
      searchText: "",
      mousedownState: false, // mousedown on option menu
      pointer: -1,
    }
  },
  watch: {
    value(newValue) {
      this.pointer = this.filteredOptions.findIndex(option => {
        return option.value === this.optionValue(newValue)
      })
    },
    filteredOptions() {
      this.pointerAdjust()
    },
  },
  computed: {
    searchTextCustomAttr() {
      if (this.selectedOption && this.selectedOption.value) {
        return this.customAttr(this.selectedOption)
      }
      return ""
    },
    inputText() {
      if (this.searchText) {
        return ""
      } else {
        let text = this.placeholder
        if (this.selectedOption) {
          text = this.selectedOption.text
        }
        return text
      }
    },
    customAttrs() {
      try {
        if (Array.isArray(this.options)) {
          return this.options.map(o => this.customAttr(o))
        }
      } catch (e) {
        // if there is an error, just return an empty array
      }
      return []
    },
    textClass() {
      if (!this.selectedOption && this.placeholder) {
        return "default"
      } else {
        return ""
      }
    },
    menuClass() {
      return {
        visible: this.showMenu,
        hidden: !this.showMenu,
      }
    },
    menuStyle() {
      return {
        display: this.showMenu ? "block" : "none",
      }
    },
    filteredOptions() {
      if (this.searchText) {
        return this.options.filter((option) => {
          try {
            return this.filterPredicate(option.text, this.searchText)
          } catch (e) {
            return true
          }
        })
      } else {
        return this.options
      }
    },
    selectedOption() {
      return this.options.find(option => {
        return option.value === this.optionValue(this.value)
      })
    },
  },
  methods: {
    onInput(event) {
      this.searchText = event.target.value;
      this.$emit("input", event.target.value);
    },
    deleteTextOrItem() {
      if (!this.searchText && this.value) {
        this.selectItem({})
        this.openOptions()
      }
    },
    openOptions() {
      if(this.editable) {
        this.$refs.input.focus()
      }
      this.showMenu = true
      this.mousedownState = false
    },
    blurInput() {
      if (!this.mousedownState) {
        this.closeOptions()
      }
      this.$emit("blur")
    },
    closeOptions() {
      if(this.editable) {
        this.$refs.input.blur()
      }
      this.showMenu = false
    },
    prevItem() {
      const prevIndex = this.pointer - 1
      const prevIndexScrollTop = this.$el.offsetHeight * prevIndex
      if (prevIndex >= 0) {
        this.pointer = prevIndex
      }
      // move scroll
      this.$refs.menu.scrollTop = prevIndexScrollTop
    },
    nextItem() {
      const nextIndex = this.pointer + 1
      const nextIndexScrollTop = this.$el.offsetHeight * nextIndex
      if (nextIndex <= (this.filteredOptions.length - 1)) {
        this.pointer = nextIndex
      }
      // move scroll
      // const totalHeight = this.filteredOptions.length * this.$el.offsetHeight
      // const totalPage = Math.ceil(totalHeight / pageSizeHeight)
      const currentMenuHeight = this.$refs.menu.offsetHeight
      const currentPage = Math.ceil((this.$refs.menu.scrollTop + this.$el.offsetHeight) / currentMenuHeight)
      const itemPage = Math.ceil(nextIndexScrollTop / currentMenuHeight)

      if (currentPage !== itemPage) {
        this.$refs.menu.scrollTop = (itemPage - 1) * this.$refs.menu.offsetHeight
      }
    },
    enterItem() {
      const currentItem = this.filteredOptions[this.pointer]
      const disabledItem = currentItem.disabled

      if (currentItem && !disabledItem) {
        this.selectItem(currentItem)
      }
    },
    pointerSet(index) {
      this.pointer = index
    },
    pointerAdjust() {
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0
      }
    },
    mousedownItem() {
      this.mousedownState = true
    },
    selectItem(option) {
      this.searchText = ""
      this.closeOptions()
      if (typeof this.value === "object" && this.value) {
        this.$emit("input", option);
      } else {
        this.$emit("input", option.value);
        if (option.value !== undefined && option.value === option.text) {
          this.searchText = option.value
        }
      }
    },
    optionValue(value) {
      if (typeof value === "object" && value !== null) {
        return value.value
      } else {
        return value
      }
    },
  },
}
</script>