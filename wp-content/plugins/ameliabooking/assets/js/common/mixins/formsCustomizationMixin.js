export default {
  data () {
    return {
      defaultFormsData: {
        stepByStepForm: {
          selectServiceForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              serviceHeadingFormField: {
                labels: {
                  please_select_service: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  book_appointment: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            },
            itemsDraggable: {
              serviceFormField: {
                labels: {
                  service: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              servicePackageFormField: {
                labels: {
                  package_available: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  package_discount_text: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              locationFormField: {
                labels: {
                  locations: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true,
                required: false
              },
              employeeFormField: {
                labels: {
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  any_employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true,
                required: false,
                anyEmployeeVisible: true
              },
              bringingFormField: {
                labels: {
                  bringing_anyone_with_you: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  number_of_additional_persons: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              addExtraFormField: {
                labels: {
                  add_extra: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  extra_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  qty_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  duration_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  price_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            }
          },
          calendarDateTimeForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135
            },
            itemsStatic: {
              timeZoneFormField: {
                visibility: false
              },
              calendarHeadingFormField: {
                labels: {
                  pick_date_and_time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              calendarAppointmentFormField: {
                endDateVisibility: true
              },
              recurringSwitchFormField: {
                labels: {
                  recurring_active: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            }
          },
          recurringSetupForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135,
              formInputColor: 'rgba(0, 0, 0, 0)',
              formInputTextColor: '#ffffff',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              recurringSetupHeadingFormField: {
                labels: {
                  recurring_active: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              recurringSettingsFormField: {
                labels: {
                  recurring_repeat: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_every: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_on: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_until: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_times: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          recurringDatesForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              recurringDatesHeadingFormField: {
                labels: {
                  recurring_appointments: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_edit: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              recurringInfoFormField: {
                labels: {
                  date: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          selectPackageForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              packageHeadingFormField: {
                labels: {
                  please_select_package: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              packageFormField: {
                labels: {
                  package_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          packageInfoForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            itemsStatic: {
              packageInfoFormField: {
                labels: {
                  package_discount_text: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  employees: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          packageSetupForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135,
              formInputColor: 'rgba(0, 0, 0, 0.1)',
              formInputTextColor: '#ffffff',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              packageEmployeeFormField: {
                labels: {
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  any_employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                anyEmployeeVisible: true
              },
              packageLocationFormField: {
                labels: {
                  location: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              packageRulesFormField: {
                labels: {
                  package_min_book: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  package_min_book_plural: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              packageCalendarFormField: {
                labels: {
                  no_selected_slot_requirements: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                endDateVisibility: true,
                timeZoneVisibility: true
              }
            }
          },
          packageListForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            itemsStatic: {
              packageListFormField: {
                labels: {
                  package_list_overview: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  appointments: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  appointment: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  date: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  location: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          confirmBookingForm: {
            appointment: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                confirmServiceHeadingFormField: {
                  visibility: true
                },
                confirmHeadingDataFormField: {
                  labels: {
                    employee: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    date_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    time_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    location_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                recurringStringFormField: {
                  labels: {
                    recurring_active: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    total_number_of_persons: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    extras_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    discount_amount_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    recurring_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            },
            package: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            }
          },
          congratulationsForm: {
            appointment: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052',
                formImageColor: '#1A84EE'
              },
              itemsStatic: {
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            },
            package: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052',
                formImageColor: '#1A84EE'
              },
              itemsStatic: {
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            }
          }
        },
        catalogForm: {
          catalogListForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            labels: {
              categories: {
                value: '',
                translations: {
                  x: ''
                },
                visibility: true
              },
              services_lower: {
                value: '',
                translations: {
                  x: ''
                },
                visibility: true
              }
            },
            parts: {
              service_images_thumbs: {
                visibility: true
              }
            }
          },
          categoryListForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            labels: {
              back: {
                value: '',
                translations: {
                  x: ''
                }
              },
              view_more: {
                value: '',
                translations: {
                  x: ''
                }
              },
              price_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              services: {
                value: '',
                translations: {
                  x: ''
                }
              },
              package: {
                value: '',
                translations: {
                  x: ''
                }
              },
              package_discount_text: {
                value: '',
                translations: {
                  x: ''
                }
              }
            },
            parts: {
              service_badge: {
                visibility: true
              },
              service_price: {
                visibility: true
              },
              service_employees_list: {
                visibility: true
              },
              package_badge: {
                visibility: true
              },
              package_price: {
                visibility: true
              },
              package_services_list: {
                visibility: true
              }
            }
          },
          categoryServiceForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            labels: {
              capacity_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              duration_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              description: {
                value: '',
                translations: {
                  x: ''
                }
              },
              service_info: {
                value: '',
                translations: {
                  x: ''
                }
              },
              category_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              extras: {
                value: '',
                translations: {
                  x: ''
                }
              },
              price_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              maximum_quantity_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              description_colon: {
                value: '',
                translations: {
                  x: ''
                }
              },
              employees: {
                value: '',
                translations: {
                  x: ''
                }
              }
            },
            parts: {
              capacity_colon: {
                visibility: true
              },
              duration_colon: {
                visibility: true
              },
              description: {
                visibility: true
              },
              service_info: {
                visibility: true
              },
              extras: {
                visibility: true
              },
              employees: {
                visibility: true
              }
            }
          },
          categoryPackageForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            parts: {
              package_rules_description: {
                visibility: true
              },
              selected_services: {
                visibility: true
              }
            }
          },
          selectServiceForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              serviceHeadingFormField: {
                labels: {
                  book_appointment: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            },
            itemsDraggable: {
              locationFormField: {
                labels: {
                  locations: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true,
                required: false
              },
              employeeFormField: {
                labels: {
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  any_employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true,
                required: false,
                anyEmployeeVisible: true
              },
              bringingFormField: {
                labels: {
                  bringing_anyone_with_you: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  number_of_additional_persons: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              addExtraFormField: {
                labels: {
                  add_extra: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  extra_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  qty_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  duration_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  price_colon: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            }
          },
          calendarDateTimeForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135
            },
            itemsStatic: {
              timeZoneFormField: {
                visibility: false
              },
              calendarHeadingFormField: {
                labels: {
                  pick_date_and_time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              calendarAppointmentFormField: {
                endDateVisibility: true
              },
              recurringSwitchFormField: {
                labels: {
                  recurring_active: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              }
            }
          },
          recurringSetupForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135,
              formInputColor: 'rgba(0, 0, 0, 0)',
              formInputTextColor: '#ffffff',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              recurringSetupHeadingFormField: {
                labels: {
                  recurring_active: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              recurringSettingsFormField: {
                labels: {
                  recurring_repeat: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_every: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_on: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_until: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_times: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          recurringDatesForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              recurringDatesHeadingFormField: {
                labels: {
                  recurring_appointments: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  recurring_edit: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                visibility: true
              },
              recurringInfoFormField: {
                labels: {
                  date: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          packageSetupForm: {
            globalSettings: {
              formTextColor: '#ffffff',
              formGradientColor1: '#1A84EE',
              formGradientColor2: '#0454A2',
              formGradientAngle: 135,
              formInputColor: 'rgba(0, 0, 0, 0.1)',
              formInputTextColor: '#ffffff',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            itemsStatic: {
              packageEmployeeFormField: {
                labels: {
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  any_employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                anyEmployeeVisible: true
              },
              packageLocationFormField: {
                labels: {
                  location: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              packageRulesFormField: {
                labels: {
                  package_min_book: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  package_min_book_plural: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              },
              packageCalendarFormField: {
                labels: {
                  no_selected_slot_requirements: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                endDateVisibility: true,
                timeZoneVisibility: true
              }
            }
          },
          packageListForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            itemsStatic: {
              packageListFormField: {
                labels: {
                  appointments: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  appointment: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  date: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  time: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  employee: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  location: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                }
              }
            }
          },
          confirmBookingForm: {
            appointment: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                confirmServiceHeadingFormField: {
                  visibility: true
                },
                confirmHeadingDataFormField: {
                  labels: {
                    employee: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    date_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    time_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    location_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                recurringStringFormField: {
                  labels: {
                    recurring_active: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    total_number_of_persons: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    extras_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    discount_amount_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    recurring_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            },
            package: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            }
          },
          congratulationsForm: {
            appointment: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052',
                formImageColor: '#1A84EE'
              },
              itemsStatic: {
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            },
            package: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052',
                formImageColor: '#1A84EE'
              },
              itemsStatic: {
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            }
          }
        },
        eventListForm: {
          globalSettings: {
            formBackgroundColor: '#ffffff',
            formTextColor: '#354052',
            formInputColor: '#ffffff',
            formInputTextColor: '#354052',
            formDropdownColor: '#ffffff',
            formDropdownTextColor: '#354052'
          },
          eventFilterForm: {
            itemsStatic: {
              eventFilterFormField: {
                labels: {
                  event_type: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  event_location: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                parts: {
                  ev_spots_number: {
                    visibility: true
                  }
                },
              }
            }
          },
          eventDetailsForm: {
            itemsStatic: {
              eventDetailsFormField: {
                labels: {
                  open: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  closed: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  canceled: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  full: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  upcoming: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  event_capacity: {
                    value: '',
                    translations: {
                      x: ''
                    },
                    visibility: true
                  },
                  location: {
                    visibility: true
                  },
                  event_date: {
                    visibility: true
                  },
                  time_zone: {
                    visibility: false
                  },
                  event_free: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  event_price: {
                    visibility: true
                  },
                  event_about: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  event_book: {
                    value: '',
                    translations: {
                      x: ''
                    },
                    visibility: true
                  },
                  event_book_persons: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  ev_spot: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  ev_spots: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  },
                  ev_no_spots: {
                    value: '',
                    translations: {
                      x: ''
                    }
                  }
                },
                parts: {
                  ev_spots_number: {
                    visibility: true
                  }
                },
                showSingleEvent: true
              }
            }
          },
          confirmBookingForm: {
            event: {
              itemsStatic: {
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    total_number_of_persons: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    discount_amount_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    recurring_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            }
          },
          congratulationsForm: {
            event: {
              itemsStatic: {
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            }
          }
        },
        eventCalendarForm: {
          selectEventCalendarForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#f2f3f5',
              formInputTextColor: '#354052',
              formDropdownColor: '#ffffff',
              formDropdownTextColor: '#354052'
            },
            labels: {
              event_today: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_filters: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_location: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_type: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_status: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_employee: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_spot: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_spots_left: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_no_spots: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_day: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_upcoming_events: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_free: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_upcoming_empty: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event: {
                value: '',
                translations: {
                  x: ''
                }
              },
              events: {
                value: '',
                translations: {
                  x: ''
                }
              },
              open: {
                value: '',
                translations: {
                  x: ''
                }
              },
              full: {
                value: '',
                translations: {
                  x: ''
                }
              },
              upcoming: {
                value: '',
                translations: {
                  x: ''
                }
              },
              closed: {
                value: '',
                translations: {
                  x: ''
                }
              },
              canceled: {
                value: '',
                translations: {
                  x: ''
                }
              }
            },
            parts: {
              ev_spots_number: {
                visibility: true
              },
              upcoming_events_block: {
                visibility: true
              },
              event_capacity_block: {
                visibility: true
              },
              event_location_block: {
                visibility: true
              },
              event_price_block: {
                visibility: true
              },
              event_day_block: {
                visibility: true
              }
            }
          },
          infoEventCalendarForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052'
            },
            labels: {
              event_book_now: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_show_less: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_schedule: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_hosted_by: {
                value: '',
                translations: {
                  x: ''
                }
              }
            },
            parts: {
              event_range_block: {
                visibility: true
              },
              event_capacity_block: {
                visibility: true
              },
              event_location_block: {
                visibility: true
              },
              event_price_block: {
                visibility: true
              }
            }
          },
          inviteEventCalendarForm: {
            globalSettings: {
              formBackgroundColor: '#ffffff',
              formTextColor: '#354052',
              formInputColor: '#ffffff',
              formInputTextColor: '#354052'
            },
            labels: {
              event_book_event: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_many_people: {
                value: '',
                translations: {
                  x: ''
                }
              },
              event_book_persons: {
                value: '',
                translations: {
                  x: ''
                }
              },
              ev_spot: {
                value: '',
                translations: {
                  x: ''
                }
              },
              ev_spots: {
                value: '',
                translations: {
                  x: ''
                }
              },
              ev_no_spots: {
                value: '',
                translations: {
                  x: ''
                }
              }
            },
            parts: {
              ev_spots_number: {
                visibility: true
              },
              event_range_block: {
                visibility: true
              },
              event_capacity_block: {
                visibility: true
              },
              event_location_block: {
                visibility: true
              }
            }
          },
          confirmBookingForm: {
            event: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                dialogEventCalendarHeadingFormField: {
                  labels: {
                    event_book_event: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  parts: {
                    event_range_block: {
                      visibility: true
                    },
                    event_capacity_block: {
                      visibility: true
                    },
                    event_location_block: {
                      visibility: true
                    }
                  }
                },
                paymentTypeFormField: {
                  labels: {
                    payment_type_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_deposit_only: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_type_full_amount: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                paymentMethodFormField: {
                  labels: {
                    payment_method_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_on_site: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_stripe: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    payment_btn_mollie: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  switchPaymentMethodView: 'Buttons',
                  switchPaymentMethodViewOptions: [{id: 1, name: this.$root.labels.buttons}, {id: 2, name: this.$root.labels.select}]
                },
                stripeCardFormField: {
                  labels: {
                    credit_or_debit_card_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                priceFormFiled: {
                  labels: {
                    total_number_of_persons: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    base_price_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    subtotal_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    discount_amount_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    deposit: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    recurring_costs_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_now: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    pay_later: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    total_cost_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                }
              },
              itemsDraggable: {
                firstNameFormField: {
                  labels: {
                    first_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  }
                },
                lastNameFormField: {
                  labels: {
                    last_name_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: true
                },
                emailFormField: {
                  labels: {
                    email_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredEmailField
                },
                phoneFormField: {
                  labels: {
                    phone_colon: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true,
                  required: this.$root.settings.general.requiredPhoneNumberField
                }
              }
            }
          },
          congratulationsForm: {
            event: {
              globalSettings: {
                formBackgroundColor: '#ffffff',
                formTextColor: '#354052',
                formInputColor: '#ffffff',
                formInputTextColor: '#354052',
                formDropdownColor: '#ffffff',
                formDropdownTextColor: '#354052'
              },
              itemsStatic: {
                dialogEventCalendarHeadingFormField: {
                  labels: {
                    event_book_event: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  parts: {
                    event_range_block: {
                      visibility: true
                    },
                    event_capacity_block: {
                      visibility: true
                    },
                    event_location_block: {
                      visibility: true
                    }
                  }
                },
                congratulationsHeadingFormField: {
                  labels: {
                    congratulations: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                congratulationsImageFormField: {
                  visibility: true
                },
                congratulationsMessagesFormField: {
                  labels: {
                    booking_completed_approved: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    },
                    booking_completed_pending: {
                      value: '',
                      translations: {
                        x: ''
                      }
                    }
                  },
                  visibility: true
                },
                addToCalendarFormField: {
                  addToCalendarVisibility: true
                }
              }
            }
          }
        }
      }
    }
  },

  methods: {
    getTranslatedForms (form) {
      let forms = (this.$root.settings.customization.forms && this.$root.settings.customization.forms.hasOwnProperty(form)) ? this.$root.settings.customization.forms : this.defaultFormsData
      let locale = window.localeLanguage[0]

      Object.keys(forms[form]).forEach(
        (screen) => {
          if ('labels' in forms[form][screen]) {
            this.getTranslatedLabels(forms[form][screen], locale)
          } else if (screen !== 'confirmBookingForm' && screen !== 'globalSettings' && screen !== 'congratulationsForm') {
            forms[form][screen] = this.getTranslatedFormScreen(forms[form][screen], form, screen, locale)
          } else if (screen === 'confirmBookingForm' || screen === 'congratulationsForm') {
            Object.keys(forms[form][screen]).forEach(
              (entity) => {
                forms[form][screen][entity] = this.getTranslatedFormScreen(forms[form][screen][entity], form, screen, locale)
              }
            )
          }
        }
      )

      return forms
    },

    getTranslatedFormScreen (forms, form, screen, locale) {
      let itemNames = ['itemsDraggable', 'itemsStatic']

      itemNames.forEach(
        (item) => {
          if (item in forms) {
            Object.keys(forms[item]).forEach(
              (block) => {
                this.getTranslatedLabels(forms[item][block], locale)
              }
            )
          }
        }
      )

      return forms
    },

    getTranslatedLabels (element, locale) {
      if ('labels' in element) {
        let settingLanguages = window.wpAmeliaSettings.general.usedLanguages
        let langDetection = settingLanguages.includes(locale)
        Object.keys(element.labels).forEach(
          (name) => {
            if ('translations' in element.labels[name] &&
              locale in element.labels[name].translations &&
              langDetection
            ) {
              element.labels[name].value = element.labels[name].translations[locale]
            } else if (element.labels[name].translations) {
              let shortSettingsLang = settingLanguages.map(l => l.length > 2 ? l.slice(0, 2) : l)
              let shortLocale = locale.length > 2 ? locale.slice(0, 2) : locale
              let shortLangDetection = shortSettingsLang.includes(shortLocale)
              let translations = Object.keys(element.labels[name].translations)
              let shortTranslations = Object.keys(element.labels[name].translations).map(transKey => transKey.length > 2 ? transKey.slice(0, 2) : transKey)

              for (let i = 0; i < shortTranslations.length; i++) {
                if (shortTranslations[i] === shortLocale && shortLangDetection) {
                  element.labels[name].value = element.labels[name].translations[translations[i]]
                  break
                }
              }
            }
          }
        )
      }
    }
  }
}
