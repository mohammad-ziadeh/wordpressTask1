<template>
  <div class="am-wrap">
    <div id="am-services" class="am-body">

      <!-- Page Header -->
      <page-header
        :bookableType="typeTab"
        :servicesTotal="countTotal"
        :categoriesTotal="categories.length"
        :packagesTotal="!showPurchasedPackages ? packages.length : -1"
        :resourcesTotal="resources ? resources.length : 0"
        @newServiceBtnClicked="showDialogNewService()"
        @newPackageBtnClicked="showDialogNewPackage()"
        @newPackageBookingBtnClicked="showDialogNewPackageBooking()"
        @newResourceBtnClicked="showDialogNewResource()"
      >
      </page-header>
      <!-- /Page Header -->

      <div class="am-section" v-if="!showPurchasedPackages">
        <el-tabs v-model="typeTab" v-if="notInLicence('pro') ? licenceVisible() : true">
          <el-tab-pane :label="$root.labels.services" name="services" :key="0"></el-tab-pane>
          <el-tab-pane name="packages" :key="1">
            <span v-if="$root.licence.isLite" slot="label" class="am-premium-tag">
              <img :src="`${$root.getUrl}public/img/am-star-gold.svg`"/>
              {{ $root.labels.packages }}
            </span>
            <template v-else slot="label">
              {{ $root.labels.packages }}
            </template>
          </el-tab-pane>
          <el-tab-pane name="resources" :key="2">
            <span v-if="$root.licence.isLite" slot="label" class="am-premium-tag">
              <img :src="`${$root.getUrl}public/img/am-star-gold.svg`"/>
              {{ $root.labels.resources }}
            </span>
            <template v-else slot="label">
              {{ $root.labels.resources }}
            </template>
          </el-tab-pane>
        </el-tabs>

        <!-- Services & Categories -->
        <div
          v-show="typeTab === 'services'"
          :key="0"
          class="am-services-categories"
        >
          <!-- Spinner -->
          <div class="am-spinner am-section" v-show="!fetched">
            <img :src="$root.getUrl+'public/img/spinner.svg'"/>
          </div>
          <!-- /Spinner -->

          <el-row v-if="fetched" class="am-flexed am-side-bar-category">
            <el-col :md="8" class="">
              <div class="am-categories-column am-section">
                <h2>
                  {{ $root.labels.categories }}
                </h2>

                <!-- All Services Filter -->
                <div
                  class="am-category-item"
                  :class="{ active: Object.keys(activeCategory).length === 0 }"
                  @click="filterServices({})"
                >
                  <h3>
                    <span class="am-category-title">
                      {{ $root.labels.all_services }}
                    </span>
                  </h3>
                </div>
                <!-- /All Services Filter -->

                <!-- Categories -->
                <draggable v-model="categories" :options="draggableOptions" @end="dropCategory">
                  <transition-group name="list-complete">
                    <div
                      v-for="category in categories"
                      :key="category.id"
                      class="am-category-item"
                      :class="{ active: activeCategory.id === category.id }"
                      @click="filterServices(category)"
                    >
                      <!-- Reorder & Title -->
                      <div class="am-category-item__inner">

                        <!-- Reorder Button -->
                        <span class="am-drag-handle">
                          <img class="svg-amelia" width="20px" :src="$root.getUrl + 'public/img/burger-menu.svg'">
                        </span>
                        <!-- /Reorder Button -->

                        <div class="am-category-photo">
                          <img :src="pictureLoad(category, false)" @error="imageLoadError(category, false)"/>
                          <span class="am-service-color" :style="bgColor(category.color)"></span>
                        </div>

                        <!-- Title Text -->
                        <span class="am-category-title">
                          <span class="am-category-name">
                            {{ category.name }}
                          </span>
                          <span class="am-category-title-id">
                            {{`(${$root.labels.id}: ${category.id})` }}
                          </span>
                        </span>
                        <!-- /Title Text -->

                        <span class="service-count">
                          {{ `${category.serviceList.length} ${category.serviceList.length === 1 ? $root.labels.service : $root.labels.services}` }}
                        </span>
                      </div>
                      <!-- /Reorder & Title -->

                      <div
                        class="am-category-item-footer"
                        @click="showDialogEditCategory(category)"
                      >
                        <img
                          class="svg-amelia edit" width="16px"
                          :src="$root.getUrl+'public/img/edit.svg'"
                        >
                      </div>
                    </div>
                  </transition-group>
                </draggable>

                <!-- Add Category Button -->
                <el-button
                  @click="showDialogNewCategory"
                  size="large"
                  type="primary"
                  class="am-dialog-create"
                  :loading="loadingAddCategory"
                >
                  <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_category }}</span>
                </el-button>

              </div>
            </el-col>

            <el-col :md="16">
              <div class="am-services-column am-section">
                <el-row :gutter="16">
                  <el-col :md="12">
                    <h2 v-show="Object.keys(activeCategory).length === 0">
                      {{$root.labels.all_services }}
                    </h2>
                    <h2 v-show="Object.keys(activeCategory).length !== 0">
                      {{ activeCategory.name }}
                    </h2>
                  </el-col>
                  <el-col :md="12" class="am-align-right">
                    <span class="am-sort-services-label">{{$root.labels.services_sorting}}</span>
                    <el-select
                      v-model="sortingServices"
                      clearable
                      placeholder="Sort Services"
                      class="am-sort-services"
                      @change="changeServiceSorting"
                    >
                      <el-option
                        v-for="sortSelection in sortingSelection"
                        :key="sortSelection.sortValue"
                        :label="sortSelection.sortName"
                        :value="sortSelection.sortValue"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <!-- Empty State For Categories -->
                <EmptyState
                  :visible="fetched && categories.length === 0"
                  :title="$root.labels.no_categories_yet"
                  :description="$root.labels.click_add_category"
                >
                </EmptyState>
                <!-- /Empty State For Categories -->

                <!-- Empty State For Services -->
                <EmptyState
                  :visible="fetched && fetchedFiltered && categories.length !== 0 && services.filter(item => item.visible).length === 0"
                  :title="$root.labels.no_services_yet"
                  :description="$root.labels.click_add_service"
                >
                </EmptyState>

                <!-- Spinner -->
                <div class="am-spinner am-section" v-show="fetched && !fetchedFiltered">
                  <img :src="$root.getUrl+'public/img/spinner.svg'"/>
                </div>
                <!-- /Spinner -->

                <!-- Services -->
                <div
                  v-show="fetchedFiltered && fetched && categories.length !== 0"
                  class="am-services-grid"
                >
                  <el-row :gutter="16">
                    <el-col :md="24">

                      <draggable v-model="services" :options="draggableOptions" @end="dropService">
                        <div
                          v-for="(service, index) in services"
                          v-show="service.visible"
                          :class="{'am-hidden-entity' : service.status === 'hidden'}"
                          class="am-service-card"
                          @click="showDialogEditService(service.id)"
                        >
                          <span class="am-drag-handle">
                            <img class="svg-amelia" width="20px" :src="$root.getUrl + 'public/img/burger-menu.svg'">
                          </span>

                          <div class="am-service-photo">
                            <img :src="pictureLoad(service, false)" @error="imageLoadError(service, false)"/>
                            <span class="am-service-color" :style="bgColor(service.color)"></span>
                          </div>

                          <div class="am-service-data">
                            <el-row :gutter="16">
                              <el-col :md="12">
                                <h4>
                                  {{ service.name }}
                                  <span class="am-service-data-id"> ({{ $root.labels.id }}: {{ service.id }})</span>
                                </h4>
                              </el-col>
                              <el-col :md="6">
                                <p>{{ $root.labels.duration }}: {{ secondsToNiceDuration(service.duration) }}</p>
                              </el-col>
                              <el-col :md="6">
                                <p>{{ $root.labels.price }}: {{ getFormattedPrice(service.price) }}</p>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </draggable>

                    </el-col>
                  </el-row>
                </div>
                <!-- /Services -->

                <!-- Pagination -->
                <pagination-block
                  :params="paginationParams"
                  :show="paginationParams.show"
                  :count="countFiltered"
                  :label="$root.labels.services.toLowerCase()"
                  :visible="fetched && fetchedFiltered && services.length !== 0 && countTotal > paginationParams.show"
                  @change="getServices"
                >
                </pagination-block>
                <!-- /Pagination -->

              </div>
            </el-col>
          </el-row>
        </div>
        <!-- /Services & Categories -->

        <!-- Packages -->
        <div
          v-if="notInLicence('pro') ? licenceVisible() : true"
          v-show="typeTab === 'packages'"
          :key="1"
          class="am-services-categories am-packages-feature"
        >

          <!-- Spinner -->
          <div class="am-spinner am-section" v-show="!fetched">
            <img :src="$root.getUrl+'public/img/spinner.svg'"/>
          </div>

          <el-row v-if="fetched" class="am-flexed">
            <el-col :md="24">
              <div class="am-services-column am-section">
                <el-row :gutter="16">
                  <el-col :md="12">
                    <h2></h2>
                    <h2></h2>
                  </el-col>
                  <el-col :md="12" class="am-align-right">
                    <span class="am-sort-services-label">{{$root.labels.packages_sorting}}</span>
                    <el-select v-model="sortingPackages" clearable placeholder="Sort Packages" class="am-sort-services" @change="changePackagesSorting">
                      <el-option
                        v-for="sortSelection in sortingSelection"
                        :key="sortSelection.sortValue"
                        :label="sortSelection.sortName"
                        :value="sortSelection.sortValue">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <!-- Empty State For Packages -->
                <EmptyState
                  :visible="fetched && packages.length === 0"
                  :licence="'pro'"
                  :title="$root.labels.no_packages_yet"
                  :description="$root.labels.click_add_package"
                >
                </EmptyState>
                <!-- /Empty State For Packages -->

                <!-- Packages -->
                <div v-show="fetched && packages.length !== 0" class="am-services-grid">
                  <el-row :gutter="16">
                    <el-col :md="24">

                      <draggable v-model="packages" :options="draggableOptions" @end="dropPackage">
                        <div
                          class="am-service-card"
                          @click="showDialogEditPackage(index)"
                          :class="{'am-hidden-entity': pack.status === 'hidden'}"
                          v-for="(pack, index) in packages"
                        >
                        <span class="am-drag-handle">
                          <img class="svg-amelia" width="20px" :src="$root.getUrl + 'public/img/burger-menu.svg'">
                        </span>

                          <div class="am-service-photo">
                            <img :src="pictureLoad(pack, false)" @error="imageLoadError(pack, false)"/>
                            <span class="am-service-color" :style="bgColor(pack.color)"></span>
                          </div>
                          <div class="am-service-data">
                            <el-row :gutter="10" class="am-appointments-flex-row-middle-align" style="margin-bottom: 0;">
                              <el-col :lg="7" :md="7" style="margin: auto;">
                                <span style="font-size: 16px; line-height: 1.5; font-weight: 500;  color: #354052;">
                                  {{ pack.name }}
                                  <span class="am-service-data-id"> ({{ $root.labels.id }}: {{ pack.id }})</span>
                                </span>
                              </el-col>
                              <el-col :lg="3" :md="3" style="margin: auto; display: flex;">
                                <p>{{ $root.labels.services }}: {{ pack.bookable.length }}</p>
                              </el-col>
                              <el-col :lg="4" :md="4" style="margin: auto; display: flex;">
                                <p>{{ $root.labels.price }}: {{ getFormattedPrice(pack.calculatedPrice ? pack.price : pack.price - pack.price / 100 * pack.discount) }}</p>
                              </el-col>
                              <el-col :lg="10" :md="10" :sm="12" class="align-right" style="margin: auto;">
                                <div @click.stop>
                                  <el-button @click="purchasedPackages(pack)">{{ $root.labels.purchased_packages }}</el-button>
                                  <el-button @click="showDialogEditPackage(index)">{{ $root.labels.edit }}</el-button>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </draggable>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- Packages -->

        <!-- Resources -->
        <div
          v-if="notInLicence('pro') ? licenceVisible() : true"
          v-show="typeTab === 'resources'"
          class="am-services-categories am-resources-feature"
          :key="2"
        >

          <el-row class="am-flexed">
            <el-col :md="24">
              <div class="am-services-column am-section">
                <el-row :gutter="16">
                  <el-col :md="24">
                    <div class="am-search">
                      <el-input
                        :disabled="notInLicence('pro')"
                        :placeholder="$root.labels.resource_search_placeholder"
                        v-model="searchResource"
                        name="search"
                      >
                      </el-input>
                    </div>
                  </el-col>
                </el-row>

                <!-- Spinner -->
                <div
                  v-show="!fetchedResources"
                  class="am-spinner am-section"
                >
                  <img :src="$root.getUrl+'public/img/spinner.svg'"/>
                </div>

                <!-- Empty State For Resources -->
                <EmptyState
                  :visible="fetchedResources && resources.length === 0 && !searchResource"
                  :licence="'pro'"
                  :title="$root.labels.no_resources_yet"
                  :description="$root.labels.click_add_resource"
                >
                </EmptyState>
                <!-- Empty State For Resources -->
                <div
                  v-show="fetchedResources && resources.length === 0 && !!searchResource"
                  class="am-empty-state am-section"
                  style="position: relative"
                >
                  <img :src="$root.getUrl+'public/img/emptystate.svg'">
                  <h2>{{ $root.labels.no_results }}</h2>
                </div>

                <!-- Resources List -->
                <div v-show="fetchedResources && resources.length !== 0" class="am-services-grid">
                  <el-row :gutter="16">
                    <el-col :md="24">
                      <div class="am-resources">
                        <!-- Resource List Header -->
                        <div class="am-resources-header" style="border-bottom: 1px solid #E2E6EC;">
                              <el-row :gutter="10" align="middle">
                                <!-- Resource List Checkbox -->
                                <el-col :lg="1" :md="1">
                                  <p>
                                    <el-checkbox
                                      v-if="$root.settings.capabilities.canDelete === true"
                                      v-model="allResourcesChecked"
                                      @change="handleCheckAllResources"
                                    >
                                    </el-checkbox>
                                  </p>
                                </el-col>

                                <!-- Resource name -->
                                <el-col :lg="3" :md="3">
                                  <p>{{ $root.labels.resource }}:</p>
                                </el-col>

                                <!-- Resource Quantity -->
                                <el-col :lg="2" :md="2">
                                  <p>{{ $root.labels.resource_quantity }}:</p>
                                </el-col>

                                <!-- Resource Services -->
                                <el-col :lg="hasLocations() ? 5 : 7" :md="hasLocations() ? 5 : 7">
                                  <p>{{ $root.labels.services }}:</p>
                                </el-col>

                                <!-- Resource Locations -->
                                <el-col :lg="5" :md="5" v-if="hasLocations()">
                                  <p>{{ $root.labels.locations }}:</p>
                                </el-col>

                                <!-- Resource Employees -->
                                <el-col :lg="hasLocations() ? 4 : 7" :md="hasLocations() ? 4 : 7">
                                  <p>{{ $root.labels.employees }}:</p>
                                </el-col>

                                <!-- Resource Type -->
                                <el-col :lg="2" :md="2">
                                  <p>{{ $root.labels.type }}:</p>
                                </el-col>

                                <!-- Resource Edit -->
                                <el-col :lg="2" :md="2">
                                  <p></p>
                                </el-col>

                          </el-row>
                        </div>

                        <!-- Resource List Content -->
                        <div>
                          <!-- Resources -->
                          <div class="am-resources-list">
                            <el-collapse>
                              <el-collapse-item
                                v-for="res in resources"
                                :key="res.id"
                                :name="res.id"
                                class="am-resource"
                                :class="{'am-hidden-entity' : res.status === 'hidden'}"
                              >

                                <template slot="title">
                                  <div class="am-resource-data">
                                    <el-row :gutter="10" align="middle">

                                      <!-- Checkbox -->
                                      <el-col :lg="1" :sm="1" style="margin-top: 4px;">
                                        <span class="am-resource-checkbox">
                                          <el-checkbox
                                            v-if="$root.settings.capabilities.canDelete === true"
                                            v-model="res.checked"
                                            :value="res.id"
                                            :label="res.id"
                                            @change="handleCheckResource"
                                          >
                                          </el-checkbox>
                                        </span>
                                      </el-col>

                                      <!-- Name -->
                                      <el-col :lg="3" :sm="3">
                                        <p class="am-col-title">{{ $root.labels.resource }}:</p>
                                        <p>{{ res.name }}</p>
                                      </el-col>

                                      <!-- Quantity -->
                                      <el-col :lg="2" :sm="2">
                                        <p class="am-col-title">{{ $root.labels.resource_quantity }}:</p>
                                        <p>{{ res.quantity }}</p>
                                      </el-col>

                                      <!-- Services -->
                                      <el-col class="am-resource-entities" :lg="hasLocations() ? 5 : 7" :sm="hasLocations() ? 5 : 7">
                                        <p class="am-col-title">{{ $root.labels.services }}:</p>
                                        <div>
                                          <p v-if="res.services && res.services.length">
                                            {{ res.services[0] ? res.services[0].name : '' }}
                                            <span class="am-resource-entities-plus" v-if="res.services.length > 1">
                                              +{{ res.services.length - 1 }}
                                            </span>
                                          </p>
                                          <p v-else>{{ $root.labels.all_services }}</p>
                                        </div>
                                      </el-col>

                                      <!-- Locations -->
                                      <el-col class="am-resource-entities" :lg="5" :sm="5" v-if="hasLocations()">
                                        <p class="am-col-title">{{ $root.labels.locations }}:</p>
                                        <div>
                                          <p v-if="res.locations && res.locations.length">
                                            {{ res.locations[0] ? res.locations[0].name : '' }}
                                            <span class="am-resource-entities-plus" v-if="res.locations.length > 1">
                                              +{{ res.locations.length - 1 }}
                                            </span>
                                          </p>
                                          <p v-else>{{ $root.labels.all_locations }}</p>
                                        </div>
                                      </el-col>

                                      <!-- Employees -->
                                      <el-col :lg="hasLocations() ? 4 : 7" :sm="hasLocations() ? 4 : 7" class="am-resource-entities">
                                        <p class="am-col-title">{{ $root.labels.employees }}:</p>

                                        <div class="am-assigned am-multiple-employees" v-if="res.employees && res.employees.length > 1">
                                          <img
                                            v-if="index <= 4"
                                            v-for="(pp, index) in res.employees" :key="pp.id"
                                            :src="pictureLoad(pp, true)"
                                            @error="imageLoadError(pp, true)"/>
                                          <span class="am-resource-entities-plus" style="margin-left: 0;" v-if="res.employees.length - 5 > 0"> +{{ res.employees.length - 5 }}</span>
                                        </div>
                                        <div v-else-if="res.employees && res.employees.length === 1" class="am-assigned">
                                          <img :src="pictureLoad(res.employees[0], true)"
                                               @error="imageLoadError(res.employees[0], true)"
                                          />
                                          <p>
                                            {{ res.employees[0].firstName + ' ' + res.employees[0].lastName }}
                                          </p>
                                        </div>
                                        <p v-else>{{ $root.labels.all_employees }}</p>
                                      </el-col>

                                      <!-- Resource Type -->
                                      <el-col :lg="2" :md="2" class="am-resource-entities">
                                        <p class="am-col-title">{{ $root.labels.type }}:</p>
                                        <p v-if="res.shared" style="margin-bottom: 0;margin-top: 8px;">
                                          {{ $root.labels.unique }}
                                        </p>
                                        <span v-if="res.shared">({{ $root.labels[res.shared] }})</span>
                                        <p v-else>
                                          {{ $root.labels.shared }}
                                        </p>
                                      </el-col>

                                      <!-- Edit button -->
                                      <el-col :lg="2" :sm="2">
                                        <div class="am-edit-btn" @click.stop>
                                          <el-button
                                            style="margin-top:0; margin-right: 15px;"
                                            class="am-button-icon"
                                            @click="showDialogEditResource(res)">
                                            <img class="svg-amelia" :alt="$root.labels.edit" :src="$root.getUrl + 'public/img/edit.svg'"/>
                                          </el-button>
                                        </div>
                                      </el-col>

                                    </el-row>
                                  </div>
                                </template>
                                <template>
                                  <div>
                                    <el-row>
                                      <el-col :lg="6" :md="6">
                                        <h3></h3>
                                      </el-col>
                                      <el-col :lg="5" :md="5" class="am-resource-entity-wrap">
                                        <p>{{ $root.labels.services }}:</p>
                                        <div class="am-resource-entity-list">
                                          <div v-if="res.services.length > 0">
                                            <p v-for="service in (showAllServices ? res.services : res.services.slice(0, 3))">
                                              {{ service.name }}
                                            </p>
                                            <p class="am-link" v-if="res.services.length > 3 && !showAllServices" @click="showAllServices = !showAllServices">
                                              {{ $root.labels.resource_view_more }}
                                            </p>
                                            <p class="am-link" v-if="res.services.length > 3 && showAllServices" @click="showAllServices = !showAllServices">
                                              {{ $root.labels.resource_view_less }}
                                            </p>
                                          </div>
                                          <p v-else>
                                            {{ $root.labels.all_services }}
                                          </p>
                                        </div>
                                      </el-col>
                                      <el-col :lg="5" :md="5" class="am-resource-entity-wrap">
                                        <p>{{ $root.labels.locations }}:</p>
                                        <div class="am-resource-entity-list">
                                          <div v-if="res.locations.length > 0">
                                            <p v-for="location in (showAllLocations ? res.locations : res.locations.slice(0, 3))">
                                              {{ location.name }}
                                            </p>
                                            <p class="am-link" v-if="res.locations.length > 3 && !showAllLocations" @click="showAllLocations = !showAllLocations">
                                              {{ $root.labels.resource_view_more }}
                                            </p>
                                            <p class="am-link" v-if="res.locations.length > 3 && showAllLocations" @click="showAllLocations = !showAllLocations">
                                              {{ $root.labels.resource_view_less }}
                                            </p>
                                          </div>
                                          <p v-else>
                                            {{ $root.labels.all_locations }}
                                          </p>
                                        </div>
                                      </el-col>
                                      <el-col :lg="5" :md="5" class="am-resource-entity-wrap">
                                        <p>{{ $root.labels.employees }}:</p>
                                        <div class="am-resource-entity-list" >
                                          <div v-if="res.employees.length > 0">
                                            <div class="am-assigned" v-for="employee in (showAllEmployees ? res.employees : res.employees.slice(0, 3))">
                                              <img :src="pictureLoad(employee, true)"
                                                   @error="imageLoadError(employee, true)"
                                              />
                                              <p>
                                                {{ employee.firstName + ' ' + employee.lastName }}
                                              </p>
                                            </div>
                                            <p class="am-link" v-if="res.employees.length > 3 && !showAllEmployees" @click="showAllEmployees = !showAllEmployees">
                                              {{ $root.labels.resource_view_more }}
                                            </p>
                                            <p class="am-link" v-if="res.employees.length > 3 && showAllEmployees" @click="showAllEmployees = !showAllEmployees">
                                              {{ $root.labels.resource_view_less }}
                                            </p>
                                          </div>
                                          <p v-else>
                                            {{ $root.labels.all_employees }}
                                          </p>
                                        </div>
                                      </el-col>
                                      <!-- Edit -->
                                      <el-col :lg="2" :sm="2">
                                        <h4></h4>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </template>
                              </el-collapse-item>
                            </el-collapse>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <!-- Selected Popover -->
                  <transition name="slide-vertical">
                    <div class="am-bottom-popover" v-if="toaster">

                      <transition name="fade">
                        <el-button
                          class="am-button-icon"
                          @click="showConfirmDelete = true"
                          v-show="!showConfirmDelete"
                        >
                          <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/delete.svg'"/>
                        </el-button>
                      </transition>

                      <transition name="slide-vertical">
                        <div class="am-bottom-popover-confirmation" v-show="showConfirmDelete">
                          <el-row type="flex" justify="start" align="middle">
                            <h3>{{ $root.labels['confirm_delete_resource' + (countCheckedResources() > 1 ? '_plural' : '') ] }}</h3>
                            <div class="align-left">
                              <el-button size="small" @click="toaster = false">
                                {{ $root.labels.cancel }}
                              </el-button>
                              <el-button
                                size="small" @click="deleteCheckedResources"
                                type="primary"
                                :loading="loadDeleteResourcesBtn"
                              >
                                {{ $root.labels.delete }}
                              </el-button>
                            </div>
                          </el-row>
                        </div>
                      </transition>

                    </div>
                  </transition>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- /Resources -->
      </div>

      <packages
        v-if="showPurchasedPackages"
        :purchased-package="purchasedPackage"
        :dialog-package-booking="dialogPackageBooking"
        @closePurchasedPackages="closePurchasedPackage"
        @closePackageBooking="dialogPackageBooking = false"
        @savePackageBookingCallback="getOptions"
      >
      </packages>

      <!-- Button New -->
      <div v-if="categories.length > 0 && $root.settings.capabilities.canWrite === true" id="am-button-new" class="am-button-new">
        <el-button
          id="am-plus-symbol"
          type="primary"
          icon="el-icon-plus"
          @click="showNewEntityDialog()"
          :class="typeTab === 'services' ? {} : licenceClassDisabled('pro')"
          :disabled="typeTab === 'services' ? false : ($root.licence.isLite || $root.licence.isStarter)"
        >
        </el-button>
      </div>
      <!-- /Button New -->

      <!-- Dialog Service -->
      <transition name="slide">
        <el-dialog
          v-if="dialogService"
          :visible.sync="dialogService"
          :close-on-click-modal="false"
          :show-close="false"
          class="am-side-dialog am-dialog-service"
        >
          <dialog-service
            :categories="categories"
            :passedService="service"
            :employees="options.employees"
            :settings=options.settings
            :futureAppointments="futureAppointments"
            :newExtraTranslations="newExtraTranslations"
            @saveCallback="saveServiceCallback"
            @duplicateCallback="duplicateServiceCallback"
            @closeDialog="dialogService = false"
            @showDialogTranslate ="showDialogTranslate"
            @extraSaved ="extraSaved"
          >
          </dialog-service>
        </el-dialog>
      </transition>
      <!-- /Dialog Service -->

      <!-- Dialog Category -->
      <transition name="slide">
        <el-dialog
          v-if="dialogCategory"
          :visible.sync="dialogCategory"
          :close-on-click-modal="false"
          :show-close="false"
          class="am-side-dialog am-dialog-service"
        >
          <dialog-category
            :passedCategory="category"
            :settings="options.settings"
            @closeDialog="dialogCategory = false"
            @saveCallback="saveCategoryCallback"
            @duplicateCallback="duplicateCategoryCallback"
            @showDialogTranslate ="showDialogTranslate"
          >
          </dialog-category>
        </el-dialog>
      </transition>
      <!-- /Dialog Category -->

      <!-- Dialog Translate -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog am-dialog-translate am-edit"
          :show-close="true"
          :visible.sync="dialogTranslate"
          :service="service"
          v-if="dialogTranslate"
        >
          <dialog-translate
            :passed-translations="dialogTranslateData"
            :name="dialogTranslateName"
            :allLanguagesData="languagesData"
            :used-languages="options.settings.general.usedLanguages"
            :type="dialogTranslateType"
            :tab="dialogTranslateTab"
            @saveDialogTranslate="saveDialogTranslate"
            @closeDialogTranslate="dialogTranslate = false"
          >
          </dialog-translate>
        </el-dialog>
      </transition>
      <!-- /Dialog Translate -->

      <!-- Dialog Package -->
      <transition name="slide">
        <el-dialog
          v-if="dialogPackage"
          :visible.sync="dialogPackage"
          :close-on-click-modal="false"
          :show-close="false"
          class="am-side-dialog am-dialog-service"
        >
          <dialog-package
            :categories="categories"
            :passedPackage="package"
            :options="{
              entitiesRelations: options.entitiesRelations,
              entities: {
                employees: options.employees,
                locations: options.locations
              }
            }"
            :settings=options.settings
            @saveCallback="savePackageCallback"
            @duplicateCallback="duplicatePackageCallback"
            @closeDialog="dialogPackage = false"
            @showDialogTranslate ="showDialogTranslate"
          >
          </dialog-package>
        </el-dialog>
      </transition>
      <!-- /Dialog Package -->

      <!-- Dialog Resource -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog am-dialog-service"
          :visible.sync="dialogResource"
          :show-close="false"
          v-if="dialogResource"
        >
          <dialog-resource
            :services="services"
            :categories="categories"
            :employees="options.employees"
            :locations="options.locations"
            :settings="options.settings"
            :passedResource="resource"
            :entities-relations="options.entitiesRelations"
            @saveCallback="saveResourceCallback"
            @duplicateCallback="duplicateResourceCallback"
            @closeDialog="dialogResource = false"
          >
          </dialog-resource>
        </el-dialog>
      </transition>
      <!-- /Dialog Resource -->

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/services-and-categories/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>
      <!-- /Help Button -->

<!--      <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import Form from 'form-object'
  import DialogService from './DialogService.vue'
  import DialogPackage from './DialogPackage.vue'
  import PageHeader from '../parts/PageHeader.vue'
  import Draggable from 'vuedraggable'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import DialogTranslate from '../parts/DialogTranslate'
  import stashMixin from '../../../js/backend/mixins/stashMixin'
  import serviceMixin from '../../../js/common/mixins/serviceMixin'
  import PaginationBlock from '../parts/PaginationBlock.vue'
  import Packages from './Packages'
  import DialogResource from './DialogResource'
  import DialogCategory from './DialogCategory.vue'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'

export default {

    mixins: [
      licenceMixin,
      imageMixin,
      dateMixin,
      durationMixin,
      priceMixin,
      serviceMixin,
      notifyMixin,
      settingsMixin,
      stashMixin
    ],

    data () {
      return {
        toaster: false,
        showConfirmDelete: false,
        loadDeleteResourcesBtn: false,
        countDeletedResources: {
          success: 0,
          error: 0
        },
        countTotal: 0,
        countFiltered: 0,
        paginationParams: {
          page: 1,
          show: this.$root.settings.general.servicesPerPage
        },
        typeTab: 'services',
        package: null,
        packages: [],
        dialogPackage: false,
        dialogPackageBooking: false,
        resources: [],
        resource: null,
        allResourcesChecked: false,
        activeCategory: {},
        categories: [],
        category: null,
        count: 0,
        dialogService: false,
        dialogCategory: false,
        dialogResource: false,
        searchResource: '',
        deleteConfirmation: false,
        draggableOptions: {
          handle: '.am-drag-handle',
          animation: 150
        },
        fetched: false,
        fetchedFiltered: false,
        fetchedResources: false,
        timer: null,
        form: new Form(),
        futureAppointments: {},
        loadingAddCategory: false,
        loadingDeleteCategory: false,
        options: {
          employees: [],
          settings: {
            payments: {
              wc: []
            },
            general: {
              usedLanguages: []
            }
          }
        },
        service: null,
        services: [],
        sortingServices: this.$root.settings.general.sortingServices,
        sortingPackages: this.$root.settings.general.sortingPackages,
        sortingSelection: [
          {
            sortName: this.$root.labels.services_sorting_name_asc,
            sortValue: 'nameAsc'
          },
          {
            sortName: this.$root.labels.services_sorting_name_desc,
            sortValue: 'nameDesc'
          },
          {
            sortName: this.$root.labels.services_sorting_price_asc,
            sortValue: 'priceAsc'
          },
          {
            sortName: this.$root.labels.services_sorting_price_desc,
            sortValue: 'priceDesc'
          },
          {
            sortName: this.$root.labels.services_sorting_custom,
            sortValue: 'custom'
          }
        ],
        svgLoaded: false,
        dialogTranslate: false,
        dialogTranslateExtra: false,
        dialogTranslateCategory: false,
        dialogTranslateType: 'name',
        dialogTranslateTab: 'service',
        dialogTranslateData: {},
        dialogTranslateName: '',
        extrasTranslateIndex: 0,
        languagesData: [],
        newExtraTranslations: null,
        showPurchasedPackages: false,
        purchasedPackage: null,
        showAllServices: false,
        showAllEmployees: false,
        showAllLocations: false
      }
    },

    created () {
      Form.defaults.axios = this.$http

      this.getOptions()

      this.getServices()
    },

    mounted () {
    },

    updated () {
      if (this.svgLoaded) this.inlineSVG()
      this.svgLoaded = true
    },

    methods: {
      hasLocations () {
        return 'locations' in this.options && this.options.locations.length
      },

      showNewEntityDialog () {
        switch (this.typeTab) {
          case 'services':
            this.showDialogNewService()
            break
          case 'packages':
            this.showPurchasedPackages ? this.showDialogNewPackageBooking() : this.showDialogNewPackage()
            break
          case 'resources':
            this.showDialogNewResource()
            break
        }
      },

      handleCheckAllResources () {
        this.resources.forEach((r) => {
          r.checked = this.allResourcesChecked
        })
        this.toaster = this.allResourcesChecked
      },

      handleCheckResource () {
        this.toaster = this.countCheckedResources() > 0
      },

      countCheckedResources () {
        return this.resources.filter(r => r.checked).length
      },

      deleteCheckedResources () {
        this.loadDeleteResourcesBtn = true

        let selectedAppointments = []

        this.resources.forEach(res => {
          if (res.checked) {
            selectedAppointments.push(res.id)
          }
        })

        this.resources.forEach(res => {
          if (res.checked) {
            this.$http.post(`${this.$root.getAjaxUrl}/resources/delete/` + res.id).then(() => {
              this.deleteResourcesCallback(selectedAppointments, true)
            }).catch(() => {
              this.deleteResourcesCallback(selectedAppointments, false)
            })
          }
        })
      },

      deleteResourcesCallback (selectedAppointments, result) {
        selectedAppointments.pop()

        if (result) {
          this.countDeletedResources.success++
        } else {
          this.countDeletedResources.error++
        }

        if (selectedAppointments.length === 0) {
          if (this.countDeletedResources.success) {
            this.notify(
              this.$root.labels.success,
              this.countDeletedResources.success + ' ' + (this.countDeletedResources.success > 1 ? this.$root.labels.resources_deleted : this.$root.labels.resource_deleted),
              'success')
          }

          if (this.countDeletedResources.error) {
            this.notify(
              this.$root.labels.error,
              this.countDeletedResources.error + ' ' + (this.countDeletedResources.error > 1 ? this.$root.labels.resources_not_deleted : this.$root.labels.resource_not_deleted),
              'error'
            )
          }

          this.countDeletedResources.success = 0
          this.countDeletedResources.error = 0

          this.getResources()

          this.resources.forEach(res => {
            res.checked = false
          })

          this.allResourcesChecked = false
          this.toaster = false
          this.loadDeleteResourcesBtn = false
          this.showConfirmDelete = false
        }
      },

      changeServiceSorting (notify = true) {
        this.fetchedFiltered = false

        this.updateServicesPositions(notify, true, true)
      },

      changePackagesSorting (notify = true) {
        switch (this.sortingPackages) {
          case ('nameAsc'):
            this.packages = this.packages.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
            break
          case ('nameDesc'):
            this.packages = this.packages.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1)
            break
          case ('priceAsc'):
            this.packages = this.packages.sort((a, b) => (a.price - (a.price * (a.discount / 100)) > b.price - (b.price * (b.discount / 100))) ? 1 : -1)
            break
          case ('priceDesc'):
            this.packages = this.packages.sort((a, b) => (a.price - (a.price * (a.discount / 100)) < b.price - (b.price * (b.discount / 100))) ? 1 : -1)
            break
        }

        this.updatePackagesPositions(notify)
      },

      updateServicesPositions (notify, updateStash, refreshServices) {
        let services = []

        this.services.forEach((service) => {
          let serviceSettings = service.settings ? JSON.parse(JSON.stringify(service.settings)) : null

          if (serviceSettings && serviceSettings.payments && serviceSettings.payments.wc.productId === this.$root.settings.payments.wc.productId) {
            delete serviceSettings.payments.wc
          }

          services.push(Object.assign(JSON.parse(JSON.stringify(service)), {settings: serviceSettings ? JSON.stringify(serviceSettings) : null}))
        })

        this.$http.post(`${this.$root.getAjaxUrl}/services/positions`, {
          services: services,
          sorting: this.sortingServices
        }).then(() => {
          if (notify) {
            this.notify(this.$root.labels.success, this.$root.labels.services_positions_saved, 'success')
          }

          if (updateStash) {
            this.updateStashEntities({})
          }

          if (refreshServices) {
            this.getServices()
          }
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.services_positions_saved_fail, 'error')
        })
      },

      updatePackagesPositions (notify) {
        this.packages.forEach(function (pack, index) {
          pack.position = index + 1
        })

        this.$http.post(`${this.$root.getAjaxUrl}/packages/positions`, {
          packages: this.packages,
          sorting: this.sortingPackages
        }).then(() => {
          if (notify) {
            this.notify(this.$root.labels.success, this.$root.labels.packages_positions_saved, 'success')
          }

          this.updateStashEntities({})
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.packages_positions_saved_fail, 'error')
        })
      },

      getServices () {
        this.fetchedFiltered = false

        this.$http.get(`${this.$root.getAjaxUrl}/services`, {params: {page: this.paginationParams.page, categoryId: this.activeCategory ? this.activeCategory.id : null}})
          .then(response => {
            this.services = response.data.data.services

            this.countTotal = response.data.data.countTotal

            this.countFiltered = response.data.data.countFiltered

            this.services.forEach((service) => {
              service.visible = true

              this.setEntitySettings(service, 'service')

              service.customPricing = this.getArrayCustomPricing(service.customPricing)
            })

            this.dialogService = false
            this.fetchedFiltered = true
          })
          .catch(e => {
            console.log(e.message)
            this.dialogService = false
            this.fetchedFiltered = true
          })
      },

      getOptions (usedLanguages = null, updatePackagePositions = false) {
        this.$http.get(`${this.$root.getAjaxUrl}/entities`, {
          params: this.getAppropriateUrlParams({
            types: ['employees', 'categories', 'packages', 'locations', 'settings', 'resources']
          })
        })
          .then(response => {
            this.options.settings.general.usedLanguages = response.data.data.settings.general.usedLanguages

            this.options.employees = response.data.data.employees

            this.options.locations = response.data.data.locations

            this.resources = response.data.data.resources

            this.options.entitiesRelations = response.data.data.entitiesRelations

            this.packages = response.data.data.packages
            this.packages.sort((a, b) => (a.position > b.position) ? 1 : -1)

            this.languagesData = response.data.data.settings.languages

            this.categories = response.data.data.categories
            this.categories.sort((a, b) => (a.position > b.position) ? 1 : -1)

            this.setupResources()

            this.packages.forEach((service) => {
              this.setEntitySettings(service, 'package')
            })

            this.fetched = true

            this.fetchedResources = true

            if (usedLanguages) {
              this.options.settings.general.usedLanguages = usedLanguages
            }
            if (updatePackagePositions === true) {
              this.changePackagesSorting(false)
            }
          })
          .catch(e => {
            console.log(e.message)
            this.fetched = true
            this.fetchedResources = true
          })
      },

      updateCategoriesPositions (notify) {
        this.$http.post(`${this.$root.getAjaxUrl}/categories/positions`, {
          categories: this.categories
        }).then(() => {
          if (notify) {
            this.notify(this.$root.labels.success, this.$root.labels.categories_positions_saved, 'success')
          }

          this.updateStashEntities({})
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.categories_positions_saved_fail, 'error')
        })
      },

      dropCategory (e) {
        if (e.newIndex !== e.oldIndex) {
          let that = this
          this.categories.forEach((category) => {
            category.position = that.categories.indexOf(category) + 1
          })
          this.updateCategoriesPositions(true)
        }
      },

      dropService (e) {
        if (e.newIndex !== e.oldIndex) {
          this.sortingServices = 'custom'
          this.updateServicesPositions(true, true, false)
        }
      },

      dropPackage (e) {
        if (e.newIndex !== e.oldIndex) {
          this.sortingPackages = 'custom'
          this.updatePackagesPositions(true)
        }
      },

      getService (id) {
        this.$http.get(`${this.$root.getAjaxUrl}/services/` + id)
          .then((response) => {
            let service = response.data.data.service

            if (service.timeBefore === null) {
              service.timeBefore = ''
            }

            if (service.timeAfter === null) {
              service.timeAfter = ''
            }

            this.setEntitySettings(service, 'service')

            this.futureAppointments = {}

            this.futureAppointments[service.id] = response.data.data.futureAppointmentsProvidersIds

            service.customPricing = this.getArrayCustomPricing(service.customPricing)

            service.extras.sort((a, b) => (a.position > b.position) ? 1 : -1)

            service.gallery.sort((a, b) => (a.position > b.position) ? 1 : -1)

            this.service = service
          })
          .catch((e) => {
            console.log(e.message)
          })
      },

      filterServices (category) {
        this.activeCategory = category

        this.paginationParams.page = 1

        this.getServices()
      },

      showDialogNewService () {
        this.service = this.getInitServiceObject()
        this.dialogService = true
      },

      showDialogNewCategory () {
        this.category = {
          status: 'visible',
          name: '',
          id: 0,
          position: this.categories.length + 1,
          color: '#1A84EE'
        }
        this.dialogCategory = true
      },

      showDialogNewPackage () {
        this.package = this.getInitPackageObject()
        this.package.position = this.packages.length + 1
        this.dialogPackage = true
      },

      showDialogNewPackageBooking () {
        this.dialogPackageBooking = true
      },

      showDialogNewResource () {
        this.resource = this.getInitResourceObject()
        this.dialogResource = true
      },

      showDialogEditResource (res) {
        this.resource = res
        this.dialogResource = true
      },

      showDialogEditService (serviceId) {
        this.service = null

        setTimeout(() => {
          this.getService(serviceId)
        }, 500)

        this.dialogService = true
      },

      showDialogEditCategory (category) {
        this.category = category
        this.dialogCategory = true
      },

      purchasedPackages (pack) {
        this.purchasedPackage = pack
        this.showPurchasedPackages = true
      },

      showDialogEditPackage (index) {
        this.package = this.packages[index]

        this.dialogPackage = true
      },

      duplicateServiceCallback (entity) {
        this.service = entity
        this.service.id = 0
        this.service.duplicated = true

        setTimeout(() => {
          this.dialogService = true
        }, 300)
      },

      duplicateCategoryCallback (entity) {
        this.category = JSON.parse(JSON.stringify(entity))

        delete this.category.id

        this.category.position = this.categories.length + 1

        this.svgLoaded = false

        this.category.serviceList.forEach((service) => {
          delete service.id

          service.extras.forEach((extra) => {
            delete extra.id
          })

          if (typeof service.settings === 'object' && service.settings !== null) {
            service.settings = JSON.stringify(service.settings)
          } else {
            service.settings = null
          }
        })

        setTimeout(() => {
          this.dialogCategory = true
        }, 300)
      },

      duplicateResourceCallback (entity) {
        this.resource = entity
        this.resource.id = 0
        this.resource.duplicated = true

        setTimeout(() => {
          this.dialogResource = true
        }, 300)
      },

      duplicatePackageCallback (entity) {
        this.package = entity
        this.package.id = 0
        this.package.duplicated = true

        setTimeout(() => {
          this.dialogPackage = true
        }, 300)
      },

      bgColor (color) {
        return {'background-color': color}
      },

      saveServiceCallback () {
        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {usedLanguages: this.options.settings.general.usedLanguages})
          .catch((e) => {
            console.log(e)
          })

        if (this.sortingServices !== 'custom' || (this.service && !this.service.position)) {
          this.updateServicesPositions(false, false, true)
        } else {
          this.getServices()
        }
        this.getOptions()
      },

      saveCategoryCallback () {
        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {usedLanguages: this.options.settings.general.usedLanguages})
          .catch((e) => {
            console.log(e)
          })

        if (this.sortingServices !== 'custom' || (this.service && !this.service.position)) {
          this.updateServicesPositions(false, false, true)
        } else {
          this.getServices()
        }
        this.getOptions()
      },

      saveResourceCallback () {
        this.getResources()
      },

      getResources () {
        this.fetchedResources = false
        this.$http.get(`${this.$root.getAjaxUrl}/resources`, {
          params: {search: this.searchResource}
        })
          .then(response => {
            this.resources = response.data.data.resources
            this.setupResources()
            this.fetchedResources = true
          })
          .catch(e => {
            console.log(e.message)
            this.fetchedResources = true
          })
      },

      setupResources () {
        let services = this.categories.map(c => c.serviceList).flat()
        this.resources.forEach(r => {
          let entities = r.entities ? Object.values(r.entities) : []
          r.locations = entities.filter(e => e.entityType === 'location')
          r.employees = entities.filter(e => e.entityType === 'employee')
          r.employees.forEach(e => {
            e.employee = this.options.employees.find(em => em.id === e.entityId)
          })
          r.locations.forEach(e => {
            e.location = this.options.locations.find(em => em.id === e.entityId)
          })
          r.services = entities.filter(e => e.entityType === 'service')
          r.services.forEach(e => {
            e.service = services.find(em => em.id === e.entityId)
          })
          r.locations = r.locations.map(l => l.location)
          r.services = r.services.map(s => s.service)
          r.employees = r.employees.map(e => e.employee)
        })
      },

      savePackageCallback () {
        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {usedLanguages: this.options.settings.general.usedLanguages})
          .catch((e) => {
            console.log(e)
          })
        this.dialogPackage = false
        this.getOptions(this.options.settings.general.usedLanguages, true)
      },

      getInitPackageObject () {
        return {
          id: 0,
          bookable: [],
          color: '#1788FB',
          description: '',
          name: '',
          pictureFullPath: '',
          pictureThumbPath: '',
          price: 0,
          calculatedPrice: true,
          discount: 0,
          status: 'visible',
          gallery: [],
          position: 0,
          settings: this.getInitEntitySettings('package'),
          endDate: null,
          durationCount: null,
          durationType: null,
          deposit: 0,
          depositPayment: 'disabled',
          translations: null,
          sharedCapacity: 0,
          quantity: 1,
          limitPerCustomer: {enabled: false, numberOfApp: 1, timeFrame: 'day', period: 1}
        }
      },

      getInitServiceObject () {
        return {
          id: 0,
          categoryId: '',
          color: '#1788FB',
          description: '',
          duration: '',
          providers: [],
          extras: [],
          maxCapacity: 1,
          minCapacity: 1,
          name: '',
          pictureFullPath: '',
          pictureThumbPath: '',
          price: 0,
          customPricing: {enabled: false, durations: []},
          status: 'visible',
          timeAfter: '',
          timeBefore: '',
          bringingAnyone: true,
          show: true,
          applyGlobally: false,
          gallery: [],
          aggregatedPrice: true,
          settings: this.getInitEntitySettings('service'),
          recurringCycle: 'disabled',
          recurringSub: 'future',
          recurringPayment: 0,
          position: 0,
          deposit: 0,
          depositPayment: 'disabled',
          depositPerPerson: 1,
          fullPayment: false,
          translations: null,
          minSelectedExtras: null,
          mandatoryExtra: false,
          maxExtraPeople: null,
          limitPerCustomer: {enabled: false, numberOfApp: 1, timeFrame: 'day', period: 1, from: 'bookingDate'}
        }
      },

      getInitResourceObject () {
        return {
          id: 0,
          name: '',
          quantity: 1,
          services: [],
          locations: [],
          employees: [],
          status: 'visible',
          shared: null,
          countAdditionalPeople: false
        }
      },

      showDialogTranslate (type, dialogTranslateTab, extraIndex) {
        this.dialogTranslateTab = dialogTranslateTab
        this.dialogTranslateType = type
        switch (dialogTranslateTab) {
          case 'service':
            this.dialogTranslateData = this.service.translations
            this.dialogTranslateName = this.service.name
            this.dialogTranslate = true
            break
          case 'extra':
            this.extrasTranslateIndex = extraIndex
            this.dialogTranslateData = this.service.extras[extraIndex] ? this.service.extras[extraIndex].translations : this.newExtraTranslations
            this.dialogTranslateName = this.service.extras[extraIndex] ? this.service.extras[extraIndex].name : null
            this.dialogTranslate = true
            break
          case 'category':
            this.dialogTranslateData = this.category.translations
            this.dialogTranslateName = this.category.name
            this.dialogTranslate = true
            break
          case 'package':
            this.dialogTranslateData = this.package.translations
            this.dialogTranslateName = this.package.name
            this.dialogTranslate = true
            break
        }
      },

      saveDialogTranslate (translations, newLanguages, tab) {
        this.options.settings.general.usedLanguages = this.options.settings.general.usedLanguages.concat(newLanguages)
        this.dialogTranslate = false

        switch (tab) {
          case ('service'):
            this.service['translations'] = translations

            break

          case ('extra'):
            if (this.service.extras[this.extrasTranslateIndex]) {
              this.service.extras[this.extrasTranslateIndex]['translations'] = translations
            } else {
              if (this.newExtraTranslations) {
                let newTranslations = JSON.parse(this.newExtraTranslations)
                if (JSON.parse(translations)['name']) {
                  newTranslations['name'] = JSON.parse(translations)['name']
                }
                if (JSON.parse(translations)['description']) {
                  newTranslations['description'] = JSON.parse(translations)['description']
                }
                this.newExtraTranslations = JSON.stringify(newTranslations)
              } else {
                this.newExtraTranslations = translations
              }
            }

            break

          case ('category'):
            this.activeCategory['translations'] = translations

            break

          case ('package'):
            this.package['translations'] = translations

            break
        }
      },

      closeDialogTranslate () {
        this.dialogTranslate = false
      },

      closePurchasedPackage () {
        this.showPurchasedPackages = false
      },

      extraSaved (extra, index) {
        this.newExtraTranslations = null
        this.service.extras[index] = extra
      },

      filterResources () {
        this.fetchedResources = false
        this.getResources()
      }
    },

    watch: {
      'searchResource' () {
        if (typeof this.searchResource !== 'undefined') {
          this.fetchedResources = true
          clearTimeout(this.timer)
          this.timer = setTimeout(this.filterResources, 300)
        }
      }
    },

    components: {
      DialogResource,
      PageHeader,
      Draggable,
      PaginationBlock,
      DialogPackage,
      DialogService,
      DialogTranslate,
      Packages,
      DialogCategory
      // DialogNewCustomize
    }

  }
</script>
