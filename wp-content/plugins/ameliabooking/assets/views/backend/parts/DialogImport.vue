<template>
  <div>

    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.import_customer_data }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form label-position="top" ref="mapForm" :model="mapForm">

        <!-- Upload file -->
        <div v-if="currentStep === 1">
          <el-form-item :label="$root.labels.upload_csv + ':'" style="margin-bottom: 16px">
            <el-upload
                drag
                action="#"
                :on-success="uploadData"
                :on-remove="removeData"
                :before-upload="loadData"
                accept=".csv"
                ref="files"
                :thumbnail-mode="true"
                :class="{'upload-disabled' : files.length >= 1 || dataLoading}"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text" v-html="$root.labels.drag_drop"></div>
            </el-upload>
          </el-form-item>

          <div class="am-import-rules am-import-rule-list">
            <img :src="$root.getUrl + 'public/img/info.svg'" style="float: left;"/>
            <b><span style="font-size: 16px;margin-left:8px">{{ $root.labels.import_rules }}</span></b>
            <div v-html="$root.labels.import_rules_desc"></div>
            <div v-html="$root.labels.import_rules_req"></div>
          </div>
        </div>
        <!-- /Upload file -->

        <!-- Map columns -->
        <div v-show="currentStep === 2" class="am-import-columns">
          <p>{{ $root.labels.imported_customers }} {{ total }}</p>
          <p>{{ $root.labels.map_data }}</p>
          <p v-html="$root.labels.required_data"></p>
          <el-alert
              v-if="doubleField"
              type="error"
              show-icon
              title=""
              :description="$root.labels.more_than_one"
              :closable="false"
              style="margin-bottom: 10px"
          />
          <el-alert
              v-if="missingValues.length"
              type="error"
              show-icon
              title=""
              :description="$root.labels.missing_value + ' ' + missingValues"
              :closable="false"
              style="margin-bottom: 10px"
          />

          <el-row v-for="(column, index) in columns" :key="index" :gutter="25">
            <el-col :lg="10" :md="10" :sm="10" :xs="10" class="am-import-columns-select">
              <el-form-item :prop="mapColumns[index].value + ' ' + index" :rules="rules.field">
                <el-select
                    v-model="mapColumns[index]"
                    @change="checkFields"
                >
                  <el-option
                      v-for="field in fields"
                      :key="field.value"
                      :label="field.label"
                      :value="field"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <p>{{ errorMessages[index] }}</p>
            </el-col>
            <el-col :lg="14" :md="14" :sm="14" :xs="14" class="am-import-columns-text">
              <span v-for="(name, index) in column" :key="index">
                <span v-if="name && index !== 0">, </span><span>{{ name }}</span>
              </span>
            </el-col>
          </el-row>

        </div>
        <!-- /Map columns -->

        <!-- Dialog Loader -->
        <div class="am-dialog-loader" v-if="dialogLoading">
          <div class="am-dialog-loader-content">
            <img :src="$root.getUrl + 'public/img/spinner.svg'" class=""/>
            <p v-html="$root.labels.importing_customers"></p>
          </div>
        </div>

        <div v-if="currentStep === 4">
          <p>{{ conflicts.length }} {{ $root.labels.customer_conflicts }}</p>
          <br>
          <p><b>{{ $root.labels.values_overwritten }}</b></p>
          <div class="am-import-rule-list">
            <ul v-for="value in valuesOverwrite">
              <li>{{ value }}</li>
            </ul>
          </div>
          <p><b>{{ $root.labels.values_saved }}</b></p>
          <div class="am-import-rule-list">
            <ul v-for="value in valuesSaved">
              <li>{{ value }}</li>
            </ul>
          </div>
        </div>

        <div v-if="currentStep === 5">
          <div v-if="addedUsers && addedUsers.length" class="am-import-outcome">
            <div v-if="!failedToAdd.length">
              <!-- Import Successful -->
              <p><b>{{ $root.labels.import_successful }}</b></p>
              <img :src="$root.getUrl+'public/img/check-circle-green-full.svg'" class=""/>
              <p>{{ $root.labels.total }} {{ addedUsers.length }} {{ $root.labels.out_of }} {{ total }} {{ $root.labels.import_successful_desc }}</p>
            </div>
            <div v-else>
              <!-- Import Partially Successful -->
              <p><b>{{ $root.labels.import_partially_successful }}</b></p>
              <img :src="$root.getUrl+'public/img/check-circle-green-partial.svg'" class=""/>
              <p>{{ $root.labels.total }} {{ addedUsers.length }} {{ $root.labels.out_of }} {{ total }} {{ $root.labels.import_successful_desc }}</p>
              <el-alert
                  type="warning"
                  show-icon
                  title=""
                  :description="failedToAdd.length + ' ' + $root.labels.customer_not_imported"
                  :closable="false"
              />
              <p>{{ $root.labels.prepared_csv }}</p>
              <el-button
                @click="exportCSV"
              >
                {{ $root.labels.download_csv }}
              </el-button>
            </div>
          </div>
          <div v-else class="am-import-outcome">
            <div>
              <!-- Import Failed -->
              <p><b>{{ $root.labels.import_failed }}</b></p>
              <img :src="$root.getUrl+'public/img/warning.svg'" class=""/>
              <p>{{ $root.labels.none_of }} {{ $root.labels.import_successful_desc }}</p>
              <p>{{ $root.labels.check_csv }}</p>
            </div>
          </div>
        </div>

      </el-form>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button
                v-if="currentStep !== 4"
                type=""
                @click="closeDialog"
            >
              <span v-if="currentStep === 5">{{ $root.labels.close }}</span>
              <span v-else>{{ $root.labels.cancel }}</span>
            </el-button>
            <el-button
                v-else
                type="primary"
                class="am-dialog-create"
                @click="skipImport"
            >
              {{ $root.labels.skip_import }}
            </el-button>
            <el-button
                v-show="showContinue"
                v-if="currentStep !== 4 && currentStep !== 5"
                type="primary"
                class="am-dialog-create"
                @click="nextStep()"
                :loading="dataLoading"
            >
              {{ $root.labels.continue }}
            </el-button>
            <el-button
                v-if="currentStep === 4"
                type="primary"
                class="am-dialog-create"
                @click="nextStep(true)"
            >
              {{ $root.labels.overwrite_records }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import moment from 'moment'

export default {

    mixins: [imageMixin, dateMixin],

    props: {
      fields: {
        type: Array,
        default: () => []
      },
      requiredFields: {
        type: Array,
        default: () => []
      },
      valuesSaved: {
        type: Array,
        default: () => []
      },
      valuesOverwrite: {
        type: Array,
        default: () => []
      },
      action: {
        type: String,
        default: null
      }
    },

    data () {
      let validateFormat = (rule, input, callback) => {
        let arr = rule.field.split(' ')
        let type = arr[0]
        let index = arr[1]
        switch (type) {
          case 'email':
            let regexEmail = /^\S+@\S+\.\S+$/
            this.data.forEach(row => {
              if (row[index] && !regexEmail.test(row[index])) {
                callback(new Error())
              }
            })
            callback()
            break
          case 'phone':
            this.data.forEach(row => {
              if (row[index] && !row[index].startsWith('+')) {
                callback(new Error())
              }
            })
            callback()
            break
          case 'birthday':
            this.data.forEach(row => {
              if (row[index] && !moment(row[index], this.momentDateFormat, true).isValid()) {
                callback(new Error())
              }
            })
            callback()
            break
          case 'gender':
            this.data.forEach(row => {
              if (row[index] && row[index] !== 'male' && row[index] !== 'female') {
                callback(new Error())
              }
            })
            callback()
            break
        }
      }

      return {
        checkAllColumns: true,
        showContinue: false,
        doubleField: false,
        missingValues: [],
        dataLoading: false,
        total: 0,
        data: [],
        conflicts: [],
        failedToAdd: [],
        addedUsers: [],
        columns: [],
        currentStep: 1,
        files: [],
        dialogLoading: false,
        mapForm: {},
        mapColumns: [],
        errorMessages: [],
        select: [],
        rules: {
          field: [
            {validator: validateFormat, message: this.$root.labels.wrong_format, trigger: 'change'}
          ]
        },
        mapRules: []
      }
    },

    updated () {
      this.inlineSVG()
      if (this.checkAllColumns && this.currentStep === 2) {
        this.$refs.mapForm.validate()
      }
    },

    mounted () {
      this.inlineSVG()
    },

    methods: {
      loadData () {
        this.showContinue = true
        this.dataLoading = true
      },

      exportCSV () {
        let exportData = []
        this.failedToAdd.forEach((user) => {
          exportData.push(this.data[user.index])
        })
        let csv = Papa.unparse(exportData, {header: false})
        let csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
        let csvURL = null
        if (navigator.msSaveBlob) {
          csvURL = navigator.msSaveBlob(csvData, 'download.csv')
        } else {
          csvURL = window.URL.createObjectURL(csvData)
        }
        let tempLink = document.createElement('a')
        tempLink.href = csvURL
        tempLink.setAttribute('download', 'data.csv')
        tempLink.click()
      },

      removeData (file, fileList) {
        let index = this.files.indexOf(file)
        if (index !== -1) {
          this.files.splice(index, 1)
        }
        if (this.files.length === 0) {
          this.showContinue = false
        }
      },

      uploadData (response, file, fileList) {
        this.files.push(file)
        this.dataLoading = false
      },

      transform (results, parser) {
        if (results.data.some(Boolean)) {
          this.total++
          this.data.push(results.data)
          results.data.forEach((col, index) => {
            if (this.columns[index]) {
              this.columns[index].push(col)
            } else {
              this.columns[index] = [col]
            }
          })
        }
      },

      skipImport () {
        this.conflicts = []
        this.nextStep()
      },

      importData () {
        this.files.forEach((file) => {
          let file2 = file.raw
          const reader = new FileReader()
          reader.onload = e => {
            let contents = e.target.result
            Papa.parse(contents, {step: this.transform, skipEmptyLines: true})
            this.columns.forEach((col, index) => {
              if (this.fields[index]) {
                this.mapColumns[index] = this.fields[index]
              } else {
                this.mapColumns[index] = this.fields[this.fields.length - 1]
              }
            })
            this.dataLoading = false
          }
          reader.readAsText(file2)
        })
      },

      checkFields () {
        this.checkAllColumns = false
        this.missingValues = []
        this.doubleField = false
        this.requiredFields.forEach(req => {
          if (!this.mapColumns.find(c => c.value === req.value)) {
            this.missingValues.push(req.label)
          }
        })
        this.doubleField = this.mapColumns.map(c => c.value).find((v, i, arr) => v !== 'dontImport' && arr.indexOf(v) !== i)
        return !(this.missingValues.length || this.doubleField)
      },

      prepareData () {
        let data = {}
        let number = 0
        this.columns.forEach((col, index) => {
          if (this.mapColumns[index].value !== 'dontImport') {
            data[this.mapColumns[index].value] = col
          }
          if (this.mapColumns[index].value === 'firstName') {
            number += col.length
          }
        })
        return {data: data, number: number}
      },

      nextStep (overwrite = false) {
        if (this.currentStep === 1) {
          this.importData()
        }
        if (this.currentStep === 2) {
          if (!this.checkFields()) return
        }
        if (this.currentStep < 5) {
          this.currentStep++
        }

        if (this.currentStep === 3 || (this.currentStep === 5 && overwrite)) {
          this.dialogLoading = true
          let data = this.prepareData()
          this.$http.post(this.action, {'data': data.data, 'number': data.number, 'overwrite': overwrite ? this.conflicts : null})
            .then((response) => {
              this.conflicts = this.conflicts.concat(response.data.data.existsUsers)
              this.failedToAdd = this.failedToAdd.concat(response.data.data.failedToAdd)
              this.addedUsers = this.addedUsers.concat(response.data.data.addedUsers)
              if (!this.conflicts.length) {
                this.currentStep++
              }
              this.$emit('getEntities')
            }).catch(e => {
              console.log(e)
            }).finally(() => {
              this.dialogLoading = false
              this.nextStep()
            })
        }
      },

      closeDialog () {
        this.$emit('closeDialogImport')
      }
    },

    components: {}
  }
</script>