<template>
  <div
    class="am-event-calendar-wrapper am-template-wrapper" :class="{'editable': editable}"
    :style="cssVars"
  >
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>
    <div
      class="am-event-calendar-holder"
      :class="{'editable': editable}"
      ref="containerStep"
    >
      <div class="am-event-left" :style="{width: upcomingBlockVisibility ? '75%' : '100%'}">
        <!-- Event Calendar Header -->
        <div class="am-event-header">
          <div class="am-event-header__left">
            <div class="am-event-header__left-inner">
              <el-button type="default" class="am-event__btn am-event__btn-today">
                {{ labelsDisplay(labelToday, languageShortCode) || $root.labels.event_today }}
              </el-button>
            </div>
            <div class="am-event-header__left-inner">
              <el-button class="am-event__btn am-event__btn-gray am-event__btn-mright" type="default" icon="el-icon-arrow-left"></el-button>
              <el-button class="am-event__btn am-event__btn-gray" type="default" icon="el-icon-arrow-right"></el-button>
            </div>
            <div class="am-event-header__left-inner">
              <div class="am-event-header__title">{{ calendarHeaderTitle }}</div>
            </div>
          </div>
          <div class="am-event-header__right">
            <div class="am-event-header__right-inner">
              <div class="am-event-search">
                <el-input
                  ref="searchInput"
                  v-model="search"
                >
                  <svg slot="prefix" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" @click="clickOnSearchIcon">
                    <path :fill="customizationForm.formInputTextColor" d="M17.71 16.29L14.31 12.9C15.407 11.5025 16.0022 9.77666 16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C9.77666 16.0022 11.5025 15.407 12.9 14.31L16.29 17.71C16.383 17.8037 16.4936 17.8781 16.6154 17.9289C16.7373 17.9797 16.868 18.0058 17 18.0058C17.132 18.0058 17.2627 17.9797 17.3846 17.9289C17.5064 17.8781 17.617 17.8037 17.71 17.71C17.8037 17.617 17.8781 17.5064 17.9289 17.3846C17.9797 17.2627 18.0058 17.132 18.0058 17C18.0058 16.868 17.9797 16.7373 17.9289 16.6154C17.8781 16.4936 17.8037 16.383 17.71 16.29ZM2 8C2 6.81332 2.3519 5.65328 3.01119 4.66658C3.67047 3.67989 4.60755 2.91085 5.7039 2.45673C6.80026 2.0026 8.00666 1.88378 9.17055 2.11529C10.3344 2.3468 11.4035 2.91825 12.2426 3.75736C13.0818 4.59648 13.6532 5.66558 13.8847 6.82946C14.1162 7.99335 13.9974 9.19975 13.5433 10.2961C13.0892 11.3925 12.3201 12.3295 11.3334 12.9888C10.3467 13.6481 9.18669 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8Z"/>
                  </svg>
                </el-input>
              </div>
            </div>
            <div class="am-event-header__right-inner">
              <el-button class="am-event__btn am-event__btn-gray" @click="toggleFiltersBlock">
                {{ labelsDisplay(labelFilters, languageShortCode) || $root.labels.event_filters }}
                <span
                  v-if="eventFilterLocation.length + eventFilterTag.length + eventFilterStatus.length + eventFilterEmployee.length > 0"
                  class="am-event__btn-tag"
                >
                  {{ eventFilterLocation.length + eventFilterTag.length + eventFilterStatus.length + eventFilterEmployee.length }}
                </span>
                <i :class="{'rotate': eventFiltersBlockShow}" class="el-icon-arrow-down"></i>
              </el-button>
            </div>
          </div>
        </div>
        <!-- /Event Calendar Header -->

        <!-- Event Calendar Filter Block -->
        <div class="am-event-filters__wrapper">
          <el-collapse v-model="eventFiltersBlockShow">
            <el-collapse-item name="1">
              <div class="am-event-filters__item">
                <el-select
                  v-model="eventFilterLocation"
                  multiple
                  clearable
                  filterable
                  collapse-tags
                  :popper-append-to-body="false"
                  :placeholder="labelsDisplay(labelLocation, languageShortCode) || $root.labels.event_location"
                  @change="eventDataConstructor"
                >
                  <template slot="prefix">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path :fill="customizationForm.formInputTextColor" d="M10 0.16674C7.54075 0.166617 5.18082 1.13713 3.43314 2.86733C1.68546 4.59753 0.69128 6.9476 0.666687 9.40674C0.666687 15.8001 8.89169 22.9167 9.24169 23.2201C9.45301 23.4008 9.72194 23.5001 10 23.5001C10.2781 23.5001 10.547 23.4008 10.7584 23.2201C11.1667 22.9167 19.3334 15.8001 19.3334 9.40674C19.3088 6.9476 18.3146 4.59753 16.5669 2.86733C14.8192 1.13713 12.4593 0.166617 10 0.16674ZM10 20.7584C8.05169 18.9034 3.00002 13.7584 3.00002 9.40674C3.00002 7.55022 3.73752 5.76975 5.05027 4.45699C6.36303 3.14424 8.1435 2.40674 10 2.40674C11.8565 2.40674 13.637 3.14424 14.9498 4.45699C16.2625 5.76975 17 7.55022 17 9.40674C17 13.7234 11.9484 18.9034 10 20.7584Z"/>
                      <path :fill="customizationForm.formInputTextColor" d="M10 4.83337C9.19241 4.83337 8.40294 5.07286 7.73144 5.52154C7.05994 5.97022 6.53656 6.60795 6.22751 7.35408C5.91845 8.10022 5.83759 8.92124 5.99514 9.71333C6.1527 10.5054 6.5416 11.233 7.11266 11.8041C7.68373 12.3751 8.41131 12.764 9.2034 12.9216C9.99548 13.0791 10.8165 12.9983 11.5626 12.6892C12.3088 12.3802 12.9465 11.8568 13.3952 11.1853C13.8439 10.5138 14.0833 9.72431 14.0833 8.91671C14.0833 7.83374 13.6531 6.79513 12.8874 6.02935C12.1216 5.26358 11.083 4.83337 10 4.83337ZM10 10.6667C9.6539 10.6667 9.31555 10.5641 9.02777 10.3718C8.73998 10.1795 8.51568 9.90617 8.38323 9.5864C8.25077 9.26663 8.21612 8.91477 8.28364 8.5753C8.35116 8.23583 8.51784 7.92401 8.76258 7.67927C9.00732 7.43453 9.31914 7.26786 9.65861 7.20033C9.99807 7.13281 10.3499 7.16746 10.6697 7.29992C10.9895 7.43237 11.2628 7.65667 11.4551 7.94446C11.6474 8.23225 11.75 8.57059 11.75 8.91671C11.75 9.38084 11.5656 9.82596 11.2375 10.1541C10.9093 10.4823 10.4641 10.6667 10 10.6667Z"/>
                    </svg>
                  </template>

                  <el-option
                    v-for="location in locations"
                    :key="location.id"
                    :label="location.name"
                    :value="location.id">
                  </el-option>
                </el-select>
              </div>
              <div class="am-event-filters__item">
                <el-select
                  v-model="eventFilterTag"
                  multiple
                  clearable
                  filterable
                  collapse-tags
                  :popper-append-to-body="false"
                  :placeholder="labelsDisplay(labelType, languageShortCode) || $root.labels.event_type"
                  @change="eventDataConstructor"
                >
                  <template slot="prefix">
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path :fill="customizationForm.formInputTextColor" d="M17.5 17.4999H2.5C1.84661 17.508 1.21666 17.2568 0.748098 16.8013C0.279533 16.3459 0.0105328 15.7233 0 15.0699V2.92994C0.0105328 2.27659 0.279533 1.65403 0.748098 1.19858C1.21666 0.743137 1.84661 0.491921 2.5 0.499942H7.1C7.24771 0.500919 7.39336 0.534605 7.5265 0.59858C7.65964 0.662555 7.77695 0.755229 7.87 0.869942L10.47 4.04994H17.47C17.796 4.04198 18.1204 4.09866 18.4244 4.21672C18.7285 4.33478 19.0061 4.51188 19.2413 4.7378C19.4765 4.96372 19.6647 5.23398 19.7949 5.53299C19.9251 5.83201 19.9948 6.15385 20 6.47994V15.0699C19.9895 15.7233 19.7205 16.3459 19.2519 16.8013C18.7833 17.2568 18.1534 17.508 17.5 17.4999Z"/>
                    </svg>
                  </template>

                  <el-option
                    v-for="(tag, index) in tags.map(eventTag => eventTag.name)"
                    :key="index"
                    :label="tag"
                    :value="tag">
                  </el-option>
                </el-select>
              </div>
              <div class="am-event-filters__item">
                <el-select
                  v-model="eventFilterStatus"
                  multiple
                  clearable
                  filterable
                  collapse-tags
                  :popper-append-to-body="false"
                  :placeholder="labelsDisplay(labelStatus, languageShortCode) || $root.labels.event_status"
                  @change="eventDataConstructor"
                >
                  <template slot="prefix">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="7.5" :stroke="customizationForm.formInputTextColor" stroke-width="3"/>
                    </svg>
                  </template>

                  <el-option
                    :label="labelsDisplay(labelOpen, languageShortCode) || $root.labels.open"
                    value="open">
                  </el-option>
                  <el-option
                    :label="labelsDisplay(labelFull, languageShortCode) || $root.labels.full"
                    value="full">
                  </el-option>
                  <el-option
                    :label="labelsDisplay(labelUpcoming, languageShortCode) || $root.labels.upcoming"
                    value="upcoming">
                  </el-option>
                  <el-option
                    :label="labelsDisplay(labelClosed, languageShortCode) || $root.labels.closed"
                    value="closed">
                  </el-option>
                  <el-option
                    :label="labelsDisplay(labelCanceled, languageShortCode) || $root.labels.canceled"
                    value="canceled">
                  </el-option>
                </el-select>
              </div>
              <div class="am-event-filters__item">
                <el-select
                  v-model="eventFilterEmployee"
                  multiple
                  clearable
                  filterable
                  collapse-tags
                  :popper-append-to-body="false"
                  :placeholder="labelsDisplay(labelEmployee, languageShortCode) || $root.labels.event_employee"
                  @change="eventDataConstructor"
                >
                  <template slot="prefix">
                    <svg width="15" height="20" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path :fill="customizationForm.formInputTextColor" d="M5.99999 7.16667C6.65926 7.16667 7.30373 6.97117 7.85189 6.6049C8.40005 6.23863 8.8273 5.71803 9.07959 5.10895C9.33188 4.49986 9.39789 3.82964 9.26927 3.18303C9.14066 2.53643 8.82319 1.94249 8.35701 1.47631C7.89084 1.01014 7.29689 0.692668 6.65029 0.564051C6.00369 0.435433 5.33347 0.501444 4.72438 0.753736C4.11529 1.00603 3.5947 1.43327 3.22842 1.98143C2.86215 2.5296 2.66666 3.17406 2.66666 3.83333C2.66666 4.71739 3.01785 5.56524 3.64297 6.19036C4.26809 6.81548 5.11593 7.16667 5.99999 7.16667ZM5.99999 2.16667C6.32963 2.16667 6.65186 2.26442 6.92594 2.44755C7.20002 2.63069 7.41364 2.89099 7.53979 3.19553C7.66594 3.50007 7.69894 3.83518 7.63463 4.15849C7.57032 4.48179 7.41159 4.77876 7.1785 5.01185C6.94541 5.24493 6.64844 5.40367 6.32514 5.46798C6.00184 5.53229 5.66673 5.49928 5.36218 5.37313C5.05764 5.24699 4.79734 5.03337 4.61421 4.75928C4.43107 4.4852 4.33332 4.16297 4.33332 3.83333C4.33332 3.39131 4.50892 2.96738 4.82148 2.65482C5.13404 2.34226 5.55796 2.16667 5.99999 2.16667Z"/>
                      <path :fill="customizationForm.formInputTextColor" d="M5.99999 8.83333C4.45289 8.83333 2.96916 9.44791 1.8752 10.5419C0.781238 11.6358 0.166656 13.1196 0.166656 14.6667C0.166656 14.8877 0.254454 15.0996 0.410734 15.2559C0.567015 15.4122 0.778976 15.5 0.99999 15.5C1.221 15.5 1.43297 15.4122 1.58925 15.2559C1.74553 15.0996 1.83332 14.8877 1.83332 14.6667C1.83332 13.5616 2.27231 12.5018 3.05371 11.7204C3.83511 10.939 4.89492 10.5 5.99999 10.5C7.10506 10.5 8.16487 10.939 8.94627 11.7204C9.72767 12.5018 10.1667 13.5616 10.1667 14.6667C10.1667 14.8877 10.2545 15.0996 10.4107 15.2559C10.567 15.4122 10.779 15.5 11 15.5C11.221 15.5 11.433 15.4122 11.5892 15.2559C11.7455 15.0996 11.8333 14.8877 11.8333 14.6667C11.8333 13.1196 11.2187 11.6358 10.1248 10.5419C9.03082 9.44791 7.54709 8.83333 5.99999 8.83333Z"/>
                    </svg>
                  </template>

                  <el-option
                    v-for="employee in employees"
                    :key="employee.id"
                    :label="`${employee.firstName} ${employee.lastName}`"
                    :value="employee.id">
                  </el-option>
                </el-select>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!-- /Event Calendar Filter Block -->

        <full-calendar
          class="am-event-calendar"
          ref="fullCalendar"
          :options="calendarOptions"
        >
        </full-calendar>
      </div>
      <div v-if="upcomingBlockVisibility" class="am-event-upcoming am-event-right">
        <div class="am-event-upcoming__heading">
          {{ labelsDisplay(labelUpcomingEvents, languageShortCode) || $root.labels.event_upcoming_events }}
          <div>
            {{ upcomingEventDateRangeDisplay() }}
          </div>
        </div>
        <div class="am-event-upcoming__block-wrapper">
          <!-- Empty State For Upcoming Events -->
          <div v-show="!upcomingEvents.length" class="am-empty-state am-section" style="text-align:center">
            <img :src="$root.getUrl + 'public/img/emptystate.svg'"/>
            <p>{{ labelsDisplay(labelUpcomingEmpty, languageShortCode) || $root.labels.event_upcoming_empty }}</p>
          </div>
          <!-- /Empty State For Upcoming Events -->

          <div v-for="calendarEvent in upcomingEvents" class="am-event-upcoming__block">
            <div class="am-event-upcoming__block-top">
              <div class="am-event-upcoming__block-top-left">
                <div class="am-event-upcoming__block-date" :class="{'am-event-upcoming__block-date-border': calendarEvent.dateRange.length > 1}">
                  <div v-for="dateItem in calendarEvent.dateRange" class="am-event-upcoming__block-date-item">
                    <div :style="{backgroundColor: calendarEvent.color}">
                      {{ upcomingEventDateDisplay(dateItem).month }}
                    </div>
                    <span>
                      {{ upcomingEventDateDisplay(dateItem).date }}
                    </span>
                  </div>
                </div>
                <div class="am-event-upcoming__block-name">
                  {{ calendarEvent.name }}
                </div>
              </div>
              <div v-if="priceBlockVisibility" class="am-event-upcoming__block-top-right">
                <div class="am-event-upcoming__block-price">
                  {{ calendarEvent.price ? getFormattedPrice(calendarEvent.price, !$root.settings.payments.hideCurrencySymbolFrontend) : ( labelsDisplay(labelFree, languageShortCode) || $root.labels.event_free) }}
                </div>
              </div>
            </div>
            <div v-if="capacityBlockVisibility || locationBlockVisibility" class="am-event-upcoming__block-bottom">
              <div v-if="capacityBlockVisibility" class="am-event-upcoming__block-info">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="customizationForm.formTextColor" d="M9.99999 9.16667C10.6593 9.16667 11.3037 8.97117 11.8519 8.6049C12.4001 8.23863 12.8273 7.71803 13.0796 7.10895C13.3319 6.49986 13.3979 5.82964 13.2693 5.18303C13.1407 4.53643 12.8232 3.94249 12.357 3.47631C11.8908 3.01014 11.2969 2.69267 10.6503 2.56405C10.0037 2.43543 9.33347 2.50144 8.72438 2.75374C8.11529 3.00603 7.5947 3.43327 7.22842 3.98143C6.86215 4.5296 6.66666 5.17406 6.66666 5.83333C6.66666 6.71739 7.01785 7.56524 7.64297 8.19036C8.26809 8.81548 9.11593 9.16667 9.99999 9.16667ZM9.99999 4.16667C10.3296 4.16667 10.6519 4.26442 10.9259 4.44755C11.2 4.63069 11.4136 4.89099 11.5398 5.19553C11.6659 5.50007 11.6989 5.83518 11.6346 6.15849C11.5703 6.48179 11.4116 6.77876 11.1785 7.01185C10.9454 7.24493 10.6484 7.40367 10.3251 7.46798C10.0018 7.53229 9.66673 7.49928 9.36218 7.37313C9.05764 7.24699 8.79734 7.03337 8.61421 6.75928C8.43107 6.4852 8.33332 6.16297 8.33332 5.83333C8.33332 5.39131 8.50892 4.96738 8.82148 4.65482C9.13404 4.34226 9.55796 4.16667 9.99999 4.16667Z"/>
                  <path :fill="customizationForm.formTextColor" d="M9.99999 10.8333C8.45289 10.8333 6.96916 11.4479 5.8752 12.5419C4.78124 13.6358 4.16666 15.1196 4.16666 16.6667C4.16666 16.8877 4.25445 17.0996 4.41073 17.2559C4.56701 17.4122 4.77898 17.5 4.99999 17.5C5.221 17.5 5.43297 17.4122 5.58925 17.2559C5.74553 17.0996 5.83332 16.8877 5.83332 16.6667C5.83332 15.5616 6.27231 14.5018 7.05371 13.7204C7.83511 12.939 8.89492 12.5 9.99999 12.5C11.1051 12.5 12.1649 12.939 12.9463 13.7204C13.7277 14.5018 14.1667 15.5616 14.1667 16.6667C14.1667 16.8877 14.2545 17.0996 14.4107 17.2559C14.567 17.4122 14.779 17.5 15 17.5C15.221 17.5 15.433 17.4122 15.5892 17.2559C15.7455 17.0996 15.8333 16.8877 15.8333 16.6667C15.8333 15.1196 15.2187 13.6358 14.1248 12.5419C13.0308 11.4479 11.5471 10.8333 9.99999 10.8333Z"/>
                </svg>
                <div class="am-event-upcoming__block-info-text">
                  {{ calendarEvent.maxCapacity - calendarEvent.places }}/{{ calendarEvent.maxCapacity }}
                </div>
              </div>
              <div v-if="locationBlockVisibility" class="am-event-upcoming__block-info">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.9">
                    <path :fill="customizationForm.formTextColor" d="M9.99999 1.66666C8.24337 1.66658 6.55771 2.3598 5.30936 3.59566C4.06102 4.83152 3.35089 6.51013 3.33333 8.26666C3.33333 12.8333 9.20833 17.9167 9.45833 18.1333C9.60927 18.2624 9.80137 18.3334 9.99999 18.3334C10.1986 18.3334 10.3907 18.2624 10.5417 18.1333C10.8333 17.9167 16.6667 12.8333 16.6667 8.26666C16.6491 6.51013 15.939 4.83152 14.6906 3.59566C13.4423 2.3598 11.7566 1.66658 9.99999 1.66666ZM9.99999 16.375C8.60833 15.05 4.99999 11.375 4.99999 8.26666C4.99999 6.94058 5.52678 5.66881 6.46446 4.73113C7.40214 3.79345 8.67391 3.26666 9.99999 3.26666C11.3261 3.26666 12.5978 3.79345 13.5355 4.73113C14.4732 5.66881 15 6.94058 15 8.26666C15 11.35 11.3917 15.05 9.99999 16.375Z"/>
                    <path :fill="customizationForm.formTextColor" d="M10 5C9.42313 5 8.85923 5.17106 8.37958 5.49155C7.89994 5.81203 7.5261 6.26756 7.30535 6.80051C7.08459 7.33346 7.02683 7.9199 7.13937 8.48568C7.25191 9.05146 7.5297 9.57116 7.9376 9.97906C8.34551 10.387 8.86521 10.6648 9.43098 10.7773C9.99676 10.8898 10.5832 10.8321 11.1162 10.6113C11.6491 10.3906 12.1046 10.0167 12.4251 9.53708C12.7456 9.05744 12.9167 8.49353 12.9167 7.91667C12.9167 7.14312 12.6094 6.40125 12.0624 5.85427C11.5154 5.30729 10.7735 5 10 5ZM10 9.16667C9.75277 9.16667 9.5111 9.09336 9.30553 8.956C9.09997 8.81865 8.93976 8.62343 8.84515 8.39502C8.75054 8.16661 8.72578 7.91528 8.77402 7.6728C8.82225 7.43033 8.9413 7.2076 9.11611 7.03278C9.29093 6.85797 9.51366 6.73892 9.75613 6.69068C9.99861 6.64245 10.2499 6.66721 10.4784 6.76182C10.7068 6.85643 10.902 7.01664 11.0393 7.2222C11.1767 7.42777 11.25 7.66944 11.25 7.91667C11.25 8.24819 11.1183 8.56613 10.8839 8.80055C10.6495 9.03497 10.3315 9.16667 10 9.16667Z"/>
                  </g>
                </svg>
                <div class="am-event-upcoming__block-info-text">
                  {{ calendarEvent.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Dialog -->
      <customize-edit-dialog
        :form-field="formStepData"
        :language-short-code="languageShortCode"
        @saveEdit="saveFormEdit"
      >
        <template v-slot:fieldEdit>
          <span v-show="editable" class="am-customize-field__edit">
            <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
          </span>
        </template>
      </customize-edit-dialog>
      <!-- /Edit Dialog -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import customizationFormHeader from '../parts/CustomizationFormHeader'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'

export default {
  name: 'selectEventCalendarForm',

  components: {
    FullCalendar,
    customizationFormHeader,
    customizeEditDialog
  },

  mixins: [priceMixin, cssColorManipulationMixin],

  props: {
    formName: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    activeEventStep: {
      type: String,
      default: '1'
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formStepData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},

      calendarOptions: {
        locale: window.localeLanguage[0].replace(/_/g, "-"),
        plugins: [ interactionPlugin, dayGridPlugin, listPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: false,
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        aspectRatio: 1.2,
        firstDay: this.$root.settings.wordpress.startOfWeek,
        dayMaxEvents: true,
        selectable: true,
        unselectAuto: false,
        selectLongPressDelay: 0,
        dayCellClassNames: 'am-event-day-wrapper',
        unselectCancel: '.am-event-more-link',
        eventClassNames: 'am-event-block',
        eventContent: this.calendarEventBlock,
        eventClick: this.calendarEventClick,
        dateClick: this.calendarDateClick,
        moreLinkContent: this.calendarMoreLinkBlock,
        moreLinkClick: this.calendarMoreLinkClick,
        events: []
      },

      // calendar filters
      eventFiltersBlockShow: '',
      eventFilterTag: [],
      eventFilterLocation: [],
      eventFilterStatus: [],
      eventFilterEmployee: [],

      // calendar header
      calendarEventsRange: [],
      calendarHeaderTitle: `${moment().format('MMMM YYYY')}`,

      // calendar search
      search: '',

      // calendar events data
      events: [],
      calendarEvents: [],
      upcomingEvents: [],
      originalEventsArray: [
        {
          id: 1,
          type: 'event',
          name: 'Event 1',
          status: 'approved',
          color: '#1788FB',
          price: 10,
          maxCapacity: 3,
          places: 3,
          locationId: 1,
          location: 'Location 1',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: false,
          cancelable: false,
          opened: false,
          closed: true,
          upcoming: false,
          full: true,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 1,
              periodStart: `${moment().startOf('month').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(1, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 1,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 1,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 1,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 1,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 2,
          type: 'event',
          name: 'Event 2',
          status: 'approved',
          color: '#fb1717',
          price: null,
          maxCapacity: 3,
          places: 0,
          locationId: 1,
          location: 'Location 1',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: false,
          cancelable: false,
          opened: false,
          closed: true,
          upcoming: false,
          full: true,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 2,
              periodStart: `${moment().startOf('month').add(1, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(2, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 2,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 2,
              name: 'Tag 2'
            }
          ],
          providers: [
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 3,
          type: 'event',
          name: 'Event 2.2',
          status: 'approved',
          color: '#17cdfb',
          price: 10,
          maxCapacity: 8,
          places: 3,
          locationId: 1,
          location: 'Location 1',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(2, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(2, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(2, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(2, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(2, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 3,
              periodStart: `${moment().startOf('month').add(2, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(4, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 3,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 3,
              name: 'Tag 2'
            }
          ],
          providers: [
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 4,
          type: 'event',
          name: 'Event 3',
          status: 'approved',
          color: '#abfb17',
          price: null,
          maxCapacity: 3,
          places: 3,
          locationId: 2,
          location: 'Location 2',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: false,
          cancelable: false,
          opened: false,
          closed: true,
          upcoming: false,
          full: true,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 4,
              periodStart: `${moment().startOf('month').add(2, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(5, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 4,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 4,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 4,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 4,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 5,
          type: 'event',
          name: 'Event 4',
          status: 'approved',
          color: '#f3fb17',
          price: 10,
          maxCapacity: 6,
          places: 3,
          locationId: 1,
          location: 'Location 1',
          customLocation: null,
          translations: null,
          bookMultipleTimes: true,
          bringingAnyone: true,
          bookable: moment().startOf('month').add(6, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(6, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(6, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(6, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(6, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 5,
              periodStart: `${moment().startOf('month').add(6, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(8, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 5,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 5,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 5,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 5,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 6,
          type: 'event',
          name: 'Event 5',
          status: 'approved',
          color: '#8917fb',
          price: null,
          maxCapacity: 10,
          places: 0,
          locationId: 5,
          location: 'Location 5',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(11, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 6,
              periodStart: `${moment().startOf('month').add(11, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(15, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 3,
              eventId: 6,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 6,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 7,
          type: 'event',
          name: 'Event 6',
          status: 'approved',
          color: '#17fbcd',
          price: 10,
          maxCapacity: 10,
          places: 1,
          locationId: 3,
          location: 'Location 3',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(14, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(14, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(14, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(14, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(14, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 7,
              periodStart: `${moment().startOf('month').add(14, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(20, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 7,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 7,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 7,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 7,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 8,
          type: 'event',
          name: 'Event 7',
          status: 'approved',
          color: '#1750fb',
          price: null,
          maxCapacity: 10,
          places: 5,
          locationId: 2,
          location: 'Location 2',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(20, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(20, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(20, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(20, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(20, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 8,
              periodStart: `${moment().startOf('month').add(20, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(22, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 8,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 8,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 8,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 8,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 9,
          type: 'event',
          name: 'Event 8',
          status: 'approved',
          color: '#1750fb',
          price: 10,
          maxCapacity: 3,
          places: 3,
          locationId: 4,
          location: 'Location 4',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: false,
          cancelable: false,
          opened: false,
          closed: true,
          upcoming: false,
          full: true,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 9,
              periodStart: `${moment().startOf('month').add(24, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(27, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 9,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 9,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 9,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 9,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 10,
          type: 'event',
          name: 'Event 8.1',
          status: 'approved',
          color: '#fb1739',
          price: null,
          maxCapacity: 7,
          places: 3,
          locationId: 4,
          location: 'Location 4',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(26, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(26, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(26, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(26, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(26, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 10,
              periodStart: `${moment().startOf('month').add(26, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().startOf('month').add(27, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 10,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 10,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 10,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 10,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 11,
          type: 'event',
          name: 'Event 9',
          status: 'approved',
          color: '#fb17c2',
          price: 10,
          maxCapacity: 5,
          places: 5,
          locationId: 1,
          location: 'Location 1',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().startOf('month').add(27, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().startOf('month').add(27, 'day').diff(moment(), 'days') >= 0,
          opened: moment().startOf('month').add(27, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().startOf('month').add(27, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().startOf('month').add(27, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 11,
              periodStart: `${moment().startOf('month').add(27, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 11,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 11,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 11,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 11,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 12,
          type: 'event',
          name: 'Event 10',
          status: 'approved',
          color: '#fba017',
          price: null,
          maxCapacity: 5,
          places: 5,
          locationId: 2,
          location: 'Location 2',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().endOf('month').add(5, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().endOf('month').add(5, 'day').diff(moment(), 'days') >= 0,
          opened: moment().endOf('month').add(5, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().endOf('month').add(5, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().endOf('month').add(5, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 12,
              periodStart: `${moment().endOf('month').add(5, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').add(6, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 12,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 12,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 12,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 12,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 13,
          type: 'event',
          name: 'Event 11',
          status: 'approved',
          color: '#1785fb',
          price: 10,
          maxCapacity: 10,
          places: 5,
          locationId: 2,
          location: 'Location 2',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().endOf('month').add(7, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().endOf('month').add(7, 'day').diff(moment(), 'days') >= 0,
          opened: moment().endOf('month').add(7, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().endOf('month').add(7, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().endOf('month').add(7, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 13,
              periodStart: `${moment().endOf('month').add(7, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').add(7, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 13,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 13,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 13,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 13,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 14,
          type: 'event',
          name: 'Event 12',
          status: 'approved',
          color: '#1ffb17',
          price: null,
          maxCapacity: 10,
          places: 10,
          locationId: 2,
          location: 'Location 2',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().endOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().endOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          opened: moment().endOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().endOf('month').add(11, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().endOf('month').add(11, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 14,
              periodStart: `${moment().endOf('month').add(11, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').add(15, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 14,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 14,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 14,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 14,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 15,
          type: 'event',
          name: 'Event 13',
          status: 'approved',
          color: '#ca17fb',
          price: 10,
          maxCapacity: 10,
          places: 10,
          locationId: 3,
          location: 'Location 3',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().endOf('month').add(17, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().endOf('month').add(17, 'day').diff(moment(), 'days') >= 0,
          opened: moment().endOf('month').add(17, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().endOf('month').add(17, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().endOf('month').add(17, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 15,
              periodStart: `${moment().endOf('month').add(17, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').add(18, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 15,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 15,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 15,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 15,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        },
        {
          id: 16,
          type: 'event',
          name: 'Event 14',
          status: 'approved',
          color: '#ca17fb',
          price: null,
          maxCapacity: 10,
          places: 10,
          locationId: 5,
          location: 'Location 5',
          customLocation: null,
          bringingAnyone: true,
          bookMultipleTimes: true,
          translations: null,
          bookable: moment().endOf('month').add(19, 'day').diff(moment(), 'days') >= 0,
          cancelable: moment().endOf('month').add(19, 'day').diff(moment(), 'days') >= 0,
          opened: moment().endOf('month').add(19, 'day').diff(moment(), 'days') >= 0,
          closed: !(moment().endOf('month').add(19, 'day').diff(moment(), 'days') >= 0),
          upcoming: moment().endOf('month').add(19, 'day').diff(moment(), 'days') >= 0,
          full: false,
          description: '',
          periods: [
            {
              id: 1,
              eventId: 16,
              periodStart: `${moment().endOf('month').add(19, 'day').format('YYYY-MM-DD')} 18:00:00`,
              periodEnd: `${moment().endOf('month').add(19, 'day').format('YYYY-MM-DD')} 19:30:00`
            }
          ],
          tags: [
            {
              id: 1,
              eventId: 16,
              name: 'Tag 1'
            },
            {
              id: 2,
              eventId: 16,
              name: 'Tag 2'
            },
            {
              id: 3,
              eventId: 16,
              name: 'Tag 3'
            },
            {
              id: 4,
              eventId: 16,
              name: 'Tag 4'
            }
          ],
          providers: [
            {
              id: 1,
              type: 'provider',
              firstName: 'Isadore',
              lastName: 'Mathew',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 2,
              type: 'provider',
              firstName: 'Monna',
              lastName: 'Fisher',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 3,
              type: 'provider',
              firstName: 'Beverly',
              lastName: 'Carleton',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 4,
              type: 'provider',
              firstName: 'Lincoln',
              lastName: 'Lynwood',
              pictureFullPath: null,
              pictureThumbPath: null
            },
            {
              id: 5,
              type: 'provider',
              firstName: 'Catherina',
              lastName: 'Amber',
              pictureFullPath: null,
              pictureThumbPath: null
            }
          ]
        }
      ],

      locations: [
        {
          'id': 1,
          'name': 'Location 1',
          'pictureFullPath': null,
          'pictureThumbPath': null
        },
        {
          'id': 2,
          'name': 'Location 2',
          'pictureFullPath': null,
          'pictureThumbPath': null
        },
        {
          'id': 3,
          'name': 'Location 3',
          'pictureFullPath': null,
          'pictureThumbPath': null
        },
        {
          'id': 4,
          'name': 'Location 4',
          'pictureFullPath': null,
          'pictureThumbPath': null
        },
        {
          'id': 5,
          'name': 'Location 5',
          'pictureFullPath': null,
          'pictureThumbPath': null
        }
      ],
      tags: [
        {
          name: 'Tag 1'
        },
        {
          name: 'Tag 2'
        },
        {
          name: 'Tag 3'
        },
        {
          name: 'Tag 4'
        }
      ],
      employees: [
        {
          id: 1,
          type: 'provider',
          firstName: 'Isadore',
          lastName: 'Mathew',
          pictureFullPath: null,
          pictureThumbPath: null
        },
        {
          id: 2,
          type: 'provider',
          firstName: 'Monna',
          lastName: 'Fisher',
          pictureFullPath: null,
          pictureThumbPath: null
        },
        {
          id: 3,
          type: 'provider',
          firstName: 'Beverly',
          lastName: 'Carleton',
          pictureFullPath: null,
          pictureThumbPath: null
        },
        {
          id: 4,
          type: 'provider',
          firstName: 'Lincoln',
          lastName: 'Lynwood',
          pictureFullPath: null,
          pictureThumbPath: null
        },
        {
          id: 5,
          type: 'provider',
          firstName: 'Catherina',
          lastName: 'Amber',
          pictureFullPath: null,
          pictureThumbPath: null
        }
      ],

      labelToday: this.formStepData.labels.event_today,
      labelFilters: this.formStepData.labels.event_filters,
      labelLocation: this.formStepData.labels.event_location,
      labelType: this.formStepData.labels.event_type,
      labelStatus: this.formStepData.labels.event_status,
      labelEmployee: this.formStepData.labels.event_employee,
      labelSpot: this.formStepData.labels.event_spot,
      labelSpots: this.formStepData.labels.event_spots_left,
      labelNoSpots: this.formStepData.labels.event_no_spots,
      labelDay: this.formStepData.labels.event_day,
      labelUpcomingEvents: this.formStepData.labels.event_upcoming_events,
      labelEvent: this.formStepData.labels.event,
      labelEvents: this.formStepData.labels.events,
      labelFree: this.formStepData.labels.event_free,
      labelUpcomingEmpty: this.formStepData.labels.event_upcoming_empty,
      labelOpen: this.formStepData.labels.open,
      labelFull: this.formStepData.labels.full,
      labelUpcoming: this.formStepData.labels.upcoming,
      labelClosed: this.formStepData.labels.closed,
      labelCanceled: this.formStepData.labels.canceled,
      upcomingBlockVisibility: this.formStepData.parts.upcoming_events_block.visibility,
      capacityBlockVisibility: this.formStepData.parts.event_capacity_block.visibility,
      locationBlockVisibility: this.formStepData.parts.event_location_block.visibility,
      priceBlockVisibility: this.formStepData.parts.event_price_block.visibility
    }
  },

  created () {
    this.eventsMonthlyDateRange()
    this.eventDataConstructor()
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    this.handleResize()
  },

  methods: {
    labelsDisplay (label, language = '') {
      if (!language) {
        return label.value
      }

      return label.translations[language]
    },

    handleResize () {
      let amContainerStep = this.$refs.containerStep
      if (amContainerStep) {
        let amContainerStepWidth = amContainerStep.offsetWidth
        let amDivs = Array.from(amContainerStep.getElementsByTagName('div'))
        let calendarApi = this.$refs.fullCalendar ? this.$refs.fullCalendar.getApi() : null

        if (amContainerStepWidth < 320) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.add('mobile')
            a.classList.add('small')
          })
          this.calendarOptions.aspectRatio = 0.65
        } else if (amContainerStepWidth < 480) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.add('mobile')
            a.classList.add('small')
          })
          this.calendarOptions.aspectRatio = 0.85
        } else if (amContainerStepWidth < 680) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.remove('small')
            a.classList.add('mobile')
          })
          this.calendarOptions.aspectRatio = 0.75
        } else if (amContainerStepWidth < 768) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.remove('small')
            a.classList.add('mobile')
          })
          this.calendarOptions.aspectRatio = 0.85
        } else if (amContainerStepWidth < 992) {
          amDivs.forEach(a => {
            a.classList.remove('mobile')
            a.classList.remove('small')
            a.classList.add('tablet')
          })
          this.calendarOptions.aspectRatio = 0.9
        } else if (amContainerStepWidth < 1045) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.remove('mobile')
            a.classList.remove('small')
          })
          this.calendarOptions.aspectRatio = 0.9
        } else if (amContainerStepWidth < 1260) {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.remove('mobile')
            a.classList.remove('small')
          })
          this.calendarOptions.aspectRatio = 1
        } else {
          amDivs.forEach(a => {
            a.classList.remove('tablet')
            a.classList.remove('mobile')
            a.classList.remove('small')
          })
          this.calendarOptions.aspectRatio = 1.2
        }
        if (calendarApi) {
          calendarApi.render()
        }
      }
    },

    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      this.$emit('resetForm', resetObj)
      this.calendarRender()
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
      this.calendarRender()
    },

    clickOnSearchIcon () {
      this.$refs.searchInput.$el.children[0].focus()
    },

    toggleFiltersBlock () {
      if (this.eventFiltersBlockShow) {
        this.eventFiltersBlockShow = ''
      } else {
        this.eventFiltersBlockShow = '1'
      }
    },

    upcomingEventDateDisplay (dateItem) {
      return {
        month: moment(dateItem).format('MMM'),
        date: moment(dateItem).format('DD')
      }
    },

    eventsMonthlyDateRange (startMonth = null, endMonth = null) {
      this.calendarEventsRange = []
      this.calendarHeaderTitle = ''

      let startDateString = startMonth
        ? moment(startMonth).startOf('month').format('YYYY-MM-DD')
        : moment().startOf('month').format('YYYY-MM-DD')

      let endDateString = ''

      if (!startMonth && !endMonth) {
        endDateString = moment().add(2, 'month').endOf('month').format('YYYY-MM-DD')
      }

      if (startMonth && !endMonth) {
        endDateString = moment(startMonth).add(2, 'month').endOf('month').format('YYYY-MM-DD')
      }

      if (endMonth) {
        endDateString = moment(endMonth).endOf('month').format('YYYY-MM-DD')
      }

      if (moment(startDateString).diff(moment(endDateString)) < 0) {
        this.calendarEventsRange.push(startDateString)
        this.calendarEventsRange.push(endDateString)
        this.calendarHeaderTitle = moment(startDateString).format('MMMM YYYY')
      } else {
        this.calendarEventsRange.push(endDateString)
        this.calendarEventsRange.push(startDateString)
        this.calendarHeaderTitle = moment(endDateString).format('MMMM YYYY')
      }
    },

    upcomingEventDateRangeDisplay () {
      return `${moment(this.calendarEventsRange[0]).format('MMM DD')} - ${moment(this.calendarEventsRange[1]).format('MMM DD')}`
    },

    calendarEventBlock (eventInfo) {
      let eventColor = eventInfo.event.extendedProps.eventColor
      let spotsText = `${eventInfo.event.extendedProps.places} ${eventInfo.event.extendedProps.places === 1 ? (this.labelsDisplay(this.labelSpot, this.languageShortCode) || this.$root.labels.event_spot) : (this.labelsDisplay(this.labelSpots, this.languageShortCode) || this.$root.labels.event_spots_left)}`
      let noSpotsText = this.labelsDisplay(this.labelNoSpots, this.languageShortCode) || this.$root.labels.event_no_spots
      let spots = eventInfo.event.extendedProps.places <= 0 ? noSpotsText : spotsText
      let spotsBlock = this.numberOfSpotsVisibility ? '<span class="am-event-spots-left">' + spots + '</span>' : ''
      let day = (this.eventDayVisibility && eventInfo.event.extendedProps.places > 0 && eventInfo.event.extendedProps.day)
        ? ((this.labelsDisplay(this.labelDay, this.languageShortCode) || this.$root.labels.event_day) + ' ' + eventInfo.event.extendedProps.day) : ''

      let eventBlock = '<div class="am-event-wrapper' + (eventInfo.event.extendedProps.hovered ? ' am-event-hovered' : '') + '">' +
        '<span class="am-event-background" style="background-color: ' + eventColor + '"></span>' +
        '<span class="am-event-color" style="background-color: ' + eventColor + '"></span>' +
        '<div class="am-event-inner">' +
        '<p class="am-event-text">' + eventInfo.event.title + '</p>' +
        '</div>' +
        '<div class="am-event-spots-and-day">' +
        '<span class="am-event-spots-left">' + spotsBlock + '</span>' +
        (day ? ('<span class="am-event-day">' + day + '</span>') : '') +
        '</div>' +
        '</div>'
      return {html: eventBlock}
    },

    calendarMoreLinkBlock (moreLinkInfo) {
      let text = this.labelsDisplay(this.labelEvent, this.languageShortCode) || this.$root.labels.event
      if (moreLinkInfo.num > 1) {
        text = this.labelsDisplay(this.labelEvents, this.languageShortCode) || this.$root.labels.events
      }

      let calendarApi = this.$refs.fullCalendar.getApi()

      if (calendarApi.el.offsetWidth < 410) {
        return { html: '<div class="am-event-more-link mobile"><span class="mini">' + moreLinkInfo.num + '</span></div>' }
      } else if (calendarApi.el.offsetWidth < 600) {
        return { html: '<div class="am-event-more-link mobile"><span>' + moreLinkInfo.num + '</span>' + text + '</div>' }
      }

      return { html: '<div class="am-event-more-link"><span>+' + moreLinkInfo.num + '</span>' + text + '</div>' }
    },

    getEventAvailability (evt) {
      if (evt.status === 'approved' || evt.status === 'pending') {
        if (evt.full) {
          return {
            label: this.$root.labels.full,
            class: 'full'
          }
        }
        if (evt.upcoming) {
          return {
            label: this.$root.labels.upcoming,
            class: 'upcoming'
          }
        }
        return !evt.bookable ? {
          label: this.$root.labels.closed,
          class: 'closed'
        } : {
          label: this.$root.labels.open,
          class: 'open'
        }
      } else {
        return {
          label: this.$root.labels.canceled,
          class: 'canceled'
        }
      }
    },

    calendarEventClick (eventInfo) {},

    eventDataConstructor () {
      let builderArray = Array.from(this.originalEventsArray)

      if (this.eventFilterTag.length) {
        let filteredArray = []
        builderArray.forEach(item => {
          this.eventFilterTag.forEach(a => {
            let filteredTagItem = item.tags.filter(b => b.name === a)

            if (filteredTagItem.length && !filteredArray.filter(itemCheck => itemCheck.id === item.id).length) {
              filteredArray.push(item)
            }
          })
        })
        builderArray = Array.from(filteredArray)
      }

      if (this.eventFilterLocation.length) {
        let filteredArray = []
        builderArray.forEach(item => {
          this.eventFilterLocation.forEach(a => {
            let filteredLocationItem = item.locationId === a

            if (filteredLocationItem) {
              filteredArray.push(item)
            }
          })
        })
        builderArray = Array.from(filteredArray)
      }

      if (this.eventFilterStatus.length) {
        let filteredArray = []
        builderArray.forEach(item => {
          this.eventFilterStatus.forEach(a => {
            if (a === 'open' &&
              (item.status === 'approved' || item.status === 'pending') &&
              item.bookable) {
              filteredArray.push(item)
            }

            if (a === 'closed' &&
              (item.status === 'approved' || item.status === 'pending') &&
              !item.bookable) {
              filteredArray.push(item)
            }

            if (a === 'full' && this.getEventAvailability(item).class === 'full') {
              filteredArray.push(item)
            }

            if (a === 'upcoming' && this.getEventAvailability(item).class === 'upcoming') {
              filteredArray.push(item)
            }

            if (a === 'canceled' && item.status === 'rejected') {
              filteredArray.push(item)
            }
          })
        })
        builderArray = Array.from(filteredArray)
      }

      if (this.eventFilterEmployee.length) {
        let filteredArray = []
        builderArray.forEach(item => {
          this.eventFilterEmployee.forEach(a => {
            let filteredEmployeeItem = item.providers.filter(b => b.id === a)

            if (filteredEmployeeItem.length && !filteredArray.filter(itemCheck => itemCheck.id === item.id).length) {
              filteredArray.push(item)
            }
          })
        })
        builderArray = Array.from(filteredArray)
      }

      if (this.search) {
        builderArray = builderArray.filter(item => {
          return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      }

      if (!this.eventFilterTag.length && !this.eventFilterLocation.length && !this.eventFilterStatus.length && !this.eventFilterEmployee.length && !this.search) {
        builderArray = Array.from(this.originalEventsArray)
      }

      this.eventArrayBuilder(builderArray)
    },

    eventArrayBuilder (eventArray, $this = this) {
      this.events = []
      this.calendarEvents = []

      eventArray.forEach(function (event) {
        event.periods.forEach(function (period) {
          let periodStartDate = moment(period.periodStart.split(' ')[0])
          let periodEndDate = moment(period.periodEnd.split(' ')[0])
          let periodStartTime = moment(period.periodStart.split(' ')[1], 'HH:mm:ss').format('HH:mm:ss')
          let periodEndTime = moment(period.periodEnd.split(' ')[1], 'HH:mm:ss').format('HH:mm:ss')

          if (periodEndTime === '00:00:00') {
            periodEndTime = '24:00:00'
            periodEndDate.subtract(1, 'days')
          }

          /** if the period in the event lasts for several days */
          if (periodStartDate.diff(periodEndDate, 'days') < 0) {
            let periodDates = []

            while (periodStartDate.isSameOrBefore(periodEndDate)) {
              periodDates.push(periodStartDate.format('YYYY-MM-DD'))
              periodStartDate.add(1, 'days')
            }

            periodDates.forEach((dayPeriod, index) => {
              $this.calendarEvents.push({
                id: event.id,
                periodId: period.id,
                locationId: event.locationId,
                customLocation: event.customLocation,
                bookable: event.bookable,
                title: event.name,
                places: event.places,
                eventColor: event.color,
                hovered: false,
                start: dayPeriod + ' ' + periodStartTime,
                end: dayPeriod + ' ' + periodEndTime,
                day: (index + 1)
              })
            })
          } else {
            $this.calendarEvents.push({
              id: event.id,
              periodId: period.id,
              locationId: event.locationId,
              customLocation: event.customLocation,
              bookable: event.bookable,
              title: event.name,
              places: event.places,
              eventColor: event.color,
              hovered: false,
              start: periodStartDate.format('YYYY-MM-DD') + ' ' + periodStartTime,
              end: periodEndDate.format('YYYY-MM-DD') + ' ' + periodEndTime
            })
          }
        })

        $this.events.push(event)
      })

      let eventsToDisplay = []
      $this.calendarEvents.forEach(a => {
        if (!eventsToDisplay.find(b => (b.id === a.id && b.start.split(' ')[0] === a.start.split(' ')[0]))) {
          eventsToDisplay.push(a)
        }
      })

      $this.calendarOptions.events = eventsToDisplay
      $this.getUpcomingEvents($this.calendarEventsRange[0], 5)
    },

    getUpcomingEvents (dateFrom, eventsDisplayNumber = 1) {
      /** if selected date from the past */
      if (moment(dateFrom).diff(moment(), 'days') < 0) {
        dateFrom = moment().format('YYYY-MM-DD')
      }

      let upcomingEventsArray = []
      let allEventsArray = Array.from(this.events)

      allEventsArray.forEach(item => {
        if (item.bookable) {
          let periodsArray = item.periods.filter(period => moment(dateFrom).diff(moment(period.periodEnd.split(' ')[0]), 'days') <= 0)
          if (periodsArray.length) {
            let sortedPeriods = []
            let periodRange = []
            item.periods.sort((a, b) => moment(a.periodStart).diff(moment(b.periodStart), 'minutes')).forEach(period => {
              sortedPeriods.push(period.periodStart, period.periodEnd)
            })

            sortedPeriods.sort()
            periodRange.push(sortedPeriods[0], sortedPeriods[sortedPeriods.length - 1])

            if (moment(periodRange[0]).diff(moment(periodRange[1]), 'days') === 0) {
              periodRange.shift()
            }

            if (item.locationId && this.locations.length) {
              let location = this.locations.find((locationItem) => locationItem.id === item.locationId)
              item.location = location ? location.name : ''
            } else if (item.customLocation) {
              item.location = item.customLocation
            } else {
              item.location = ''
            }

            item.dateRange = periodRange
            upcomingEventsArray.push(item)
          }
        }
      })

      upcomingEventsArray.sort((a, b) => moment(a.periods[0].periodStart).diff(moment(b.periods[0].periodStart), 'minutes'))
      this.upcomingEvents = upcomingEventsArray.slice(0, eventsDisplayNumber)
    },

    calendarRender () {
      let amContainerStep = this.$refs.containerStep
      if (amContainerStep) {
        let calendarApi = this.$refs.fullCalendar ? this.$refs.fullCalendar.getApi() : null
        if (calendarApi) {
          this.$nextTick(() => {
            calendarApi.render()
          })
        }
      }
    }
  },

  computed: {
    numberOfSpotsVisibility () {
      return this.formStepData.parts.ev_spots_number.visibility
    },

    eventDayVisibility () {
      return this.formStepData.parts.event_day_block.visibility
    },

    cssVars () {
      return {
        // global colors - start
        '--am-primary-color': this.customization.globalColors.primaryColor,
        '--am-primary-color-opacity10': this.colorTransparency(this.customization.globalColors.primaryColor, 0.1),
        '--am-color-on-background': this.customization.globalColors.textColorOnBackground,
        // global colors - end

        // background color - start
        '--amc-background-color': this.customizationForm.formBackgroundColor,
        // background color - end

        // text color - start
        '--amc-text-color': this.customizationForm.formTextColor,
        '--amc-text-color-opacity80': this.colorTransparency(this.customizationForm.formTextColor, 0.8),
        '--amc-text-color-lighten50': this.lightenDarkenColor(this.customizationForm.formTextColor, 50),
        '--amc-text-color-lighten40': this.lightenDarkenColor(this.customizationForm.formTextColor, 40),
        // text color - end

        // input color - start
        '--amc-input-color': this.customizationForm.formInputColor,
        '--amc-input-color-darken15': this.lightenDarkenColor(this.customizationForm.formInputColor, -15),
        // input color - end

        // input text color - start
        '--amc-input-text-color': this.customizationForm.formInputTextColor,
        '--amc-input-text-color-opacity30': this.colorTransparency(this.customizationForm.formInputTextColor, 0.3),
        // input text color - end

        // dropdown color - start
        '--amc-dropdown-color': this.customizationForm.formDropdownColor,
        // dropdown color - end

        // dropdown text color - start
        '--amc-dropdown-text-color': this.customizationForm.formDropdownTextColor
        // dropdown text color - end
      }
    }
  },

  watch: {
    'formStepData' () {
      this.labelToday = this.formStepData.labels.event_today
      this.labelFilters = this.formStepData.labels.event_filters
      this.labelLocation = this.formStepData.labels.event_location
      this.labelType = this.formStepData.labels.event_type
      this.labelStatus = this.formStepData.labels.event_status
      this.labelEmployee = this.formStepData.labels.event_employee
      this.labelSpot = this.formStepData.labels.event_spot
      this.labelSpots = this.formStepData.labels.event_spots_left
      this.labelNoSpots = this.formStepData.labels.event_no_spots
      this.labelDay = this.formStepData.labels.event_day
      this.labelUpcomingEvents = this.formStepData.labels.event_upcoming_events
      this.labelFree = this.formStepData.labels.event_free
      this.labelUpcomingEmpty = this.formStepData.labels.event_upcoming_empty
      this.labelEvent = this.formStepData.labels.event
      this.labelEvents = this.formStepData.labels.events
      this.labelOpen = this.formStepData.labels.open
      this.labelFull = this.formStepData.labels.full
      this.labelUpcoming = this.formStepData.labels.upcoming
      this.labelClosed = this.formStepData.labels.closed
      this.labelCanceled = this.formStepData.labels.canceled
      this.upcomingBlockVisibility = this.formStepData.parts.upcoming_events_block.visibility
      this.capacityBlockVisibility = this.formStepData.parts.event_capacity_block.visibility
      this.locationBlockVisibility = this.formStepData.parts.event_location_block.visibility
      this.priceBlockVisibility = this.formStepData.parts.event_price_block.visibility

      this.calendarRender()
    },

    'languageShortCode' () {
      this.calendarRender()
    },

    'editable' () {
      this.calendarRender()
    },

    'activeEventStep' () {
      if (this.activeEventStep === '1') {
        this.calendarRender()
      }
    }
  }
}
</script>

<style lang="less">
// Colors
@primaryColor: var(--am-primary-color);
@primaryColorOpacity10: var(--am-primary-color-opacity10);
@colorOnBackground: var(--am-color-on-background);
@formBackgroundColor: var(--amc-background-color);
@formTextColor: var(--amc-text-color);
@formTextColorOpacity80: var(--amc-text-color-opacity80);
@formTextColorLighten50: var(--amc-text-color-lighten50);
@formTextColorLighten40: var(--amc-text-color-lighten40);
@formInputColor: var(--amc-input-color);
@formInputColorDarken15: var(--amc-input-color-darken15);
@formInputTextColor: var(--amc-input-text-color);
@formInputTextColorOpacity30: var(--amc-input-text-color-opacity30);
@formDropdownColor: var(--amc-dropdown-color);
@formDropdownTextColor: var(--amc-dropdown-text-color);

// Elements
@input: el-input;
@select: el-select;

.am-customize-page {
  .am-event {
    &-calendar {
      &-wrapper.am-template-wrapper {
        .am-event {
          &-header {
            &__title {
              color: @formTextColor;
            }
          }

          &-search {
            .el-input {
              .el-input__inner {
                color: @formInputTextColor;
                background-color: @formInputColor;
              }
            }
          }

          &-filters {
            &__item {
              .@{input} {
                &--suffix {
                  .@{input} {
                    &__inner {
                      background-color: @formInputColor;

                      &::placeholder {
                        color: @formInputTextColor;
                      }
                      &::-webkit-input-placeholder {
                        color: @formInputTextColor;
                      }
                      &::-moz-placeholder {
                        color: @formInputTextColor;
                      }
                      &:-ms-input-placeholder {
                        color: @formInputTextColor;
                      }
                      &:-moz-placeholder {
                        color: @formInputTextColor;
                      }
                    }
                  }

                  &.is-focus {
                    .@{input} {
                      &__inner {
                        background-color: @formInputColorDarken15;
                        box-shadow: 0 0 0 4px @formInputColor;
                      }
                    }
                  }
                }
              }

              .@{select} {
                .el-tag {
                  &.el-tag--info {
                    border: 1px solid @formInputTextColor;
                    background-color: @formInputColor;

                    .el-tag__close {
                      top: 1px;
                      color: @formInputColor;
                      background-color: @formInputTextColor;
                      box-shadow: 0 0 0 1px @formInputTextColor;
                      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

                      &:hover {
                        color: @formInputTextColor;
                        background-color: @formInputColor;
                      }
                    }
                  }
                }

                &-dropdown {
                  background-color: @formDropdownColor;

                  .popper__arrow {
                    &:after {
                      border-bottom-color: @formDropdownColor;
                    }
                  }

                  &__item {
                    span {
                      color: @formDropdownTextColor;
                    }

                    &.selected {
                      background-color: @primaryColor;

                      span {
                        color: @colorOnBackground;
                      }
                    }
                  }
                }

                &__tags {
                  .@{select}__tags {
                    &-text {
                      color: @formInputTextColor;
                    }
                  }
                }

                .@{input} {
                  .@{select}__caret {
                    color: @formInputTextColor;
                  }
                }
              }
            }
          }

          &-text {
            color: @formTextColor;
          }

          &-day-wrapper {
            .fc {
              &-daygrid-day-number {
                color: @formTextColor;
              }
            }
          }

          &-spots-left {
            color: @formTextColorLighten50;
          }

          &-more-link {
            color: @formTextColor;

            span {
              color: @formTextColor;
            }
          }

          &-upcoming {
            &__heading {
              color: @formTextColor;

              div {
                color: @formTextColor;
              }
            }

            &__block {
              background-color: @formBackgroundColor;

              &-name {
                color: @formTextColor;
              }

              &-price {
                color: @formTextColorLighten40;
              }

              &-date {
                &-item {
                  span {
                    color: @formTextColor;
                  }
                }
              }

              &-info {
                &-text {
                  color: @formTextColorOpacity80;
                }
              }
            }

            .am-empty-state {
              border-radius: 16px;
              background-color: @formBackgroundColor;

              p {
                color: @formTextColor;
              }
            }
          }

          &__btn {
            span, i {
              color: @formTextColor;

              &.am-event__btn-tag {
                color: @colorOnBackground;
                background-color: @primaryColor;
              }
            }

            &-today {
              background-color: @formBackgroundColor;

              &:hover, &:focus {
                background-color: @primaryColorOpacity10;
                border-color: @primaryColorOpacity10;

                span {
                  color: @primaryColor;
                }
              }
            }
          }
        }

        .fc {
          &-col {
            &-header {
              &-cell-cushion {
                color: @formTextColor;
              }
            }
          }

          &-popover {
            background-color: @formBackgroundColor;

            &-title, &-close {
              color: @formTextColor;
            }
          }
        }

        .el-collapse {
          &-item {
            &__content {
              background: linear-gradient(180deg, @formInputTextColorOpacity30 -50%, @formBackgroundColor 20%);
            }
          }
        }

        th, tr, td {
          background-color: @formBackgroundColor;
        }
      }
    }
  }
}
</style>
