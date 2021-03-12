<template>
  <div>
    <b-list-group class="list-group-flush back-to-list">
      <b-list-group-item variant="sideNav" button @click="$emit('close-details')" v-if="!snippet">
        <i class="fas fa-arrow-left" />
        {{ $t('label.backtolist') }}
      </b-list-group-item>
    </b-list-group>
    <b-list-group class="list-group-flush business-details" @click="expandBusinessDetails">
      <b-list-group-item variant="sideNav" :class="infotype + (snippet ? ' business-snippet' : '')">
        <div>
          <div @click.stop="toggleExpand">
            <div class="mobile-expand"></div>
            <div class="title">
              <i :class="businessIcon(business)"></i>
              <div class="busName">
                <h5>{{ business.name }}</h5>
                <span v-if="!!business.providerAddLoc && business.providerAddLoc !== business.name">{{ business.providerAddLoc }}</span>
                <div v-if="!!business.classificationType">{{ business.classificationType }}</div>
                <div v-if="!!business.description">{{ business.description }}</div>
              </div>
            </div>
          </div>
          <div v-if="snippet">
            <span
              class="business-open"
              v-if="hasOpenClosedInfo(business)"
              :class="isOpen(business) ? 'open' : 'closed'"
              :title="isOpen(business) ? $t('label.open') : $t('label.closed')"
            >
              <i class="fas fa-clock" />
              <span>{{ getOpenClosedMessage(business) }}</span>
            </span>
          </div>
          <tag-list :tags="business.tags"></tag-list>

          <div v-if="!snippet && getAddress(business) !== ''">
            <b>{{ $t('label.address') }}:</b><br />
            {{ getAddress(business) }}<br />
            <div v-if="business.lat && business.lng">
              <span class="list-item" @click.stop="getDirections">
                <icon-list-item icon="fa-directions" :title="$t('getdirections')" link="#" />
              </span>
              <p id="directions-options-expanded" v-if="directionsBool" class="directions-options list-item">
                <icon-list-item class="list-item" icon="fa fa-google" title="Google Maps" :link="googleDirectionsLink(business)" />
                <icon-list-item class="list-item" v-if="iOS" icon="fa fa-apple" title="Apple Maps" :link="appleDirectionsLink(business)" />
                <icon-list-item class="list-item" icon="fa-waze" iconSet="fab" title="Waze" :link="wazeDirectionsLink(business)" />
              </p>
            </div>
          </div>

          <p class="business-options" v-if="!snippet && business.options.length">
            <icon-list-item
              v-for="(opt, index) in business.options"
              v-bind:key="index"
              :icon="getOptionIcon(opt)"
              :title="$tc('label.' + opt)"
            />
          </p>

          <p v-if="!snippet" class="business-actions">
            <icon-list-item v-if="business.contact" icon="fa-phone-alt" :title="business.contact" :link="'tel:' + business.contact" />

            <icon-list-item
              v-if="business.contactspanish"
              icon="fa-phone-alt"
              :title="business.contactspanish + ' (' + $t('languages.es').toLowerCase() + ')'"
              :link="'tel:' + business.contactspanish"
            />
            <icon-list-item
              v-for="(phone, index) in business.languagePhones"
              v-bind:key="index"
              icon="fa-phone-alt"
              :title="phone.phoneNumber + ' (' + phone.language + ')'"
              :link="'tel:' + phone.phoneNumber"
            />
            <icon-list-item
              v-if="business.crisisPhone"
              icon="fa-phone-alt"
              :title="business.crisisPhone + ' (' + $t('label.crisisphone') + ')'"
              :link="'tel:' + business.crisisPhone"
              :caption="business.crisisPhoneInstructions"
            />
            <icon-list-item
              v-if="business.afterHoursPhone"
              icon="fa-phone-alt"
              :title="business.afterHoursPhone + ' (' + $t('label.afterhoursphone') + ')'"
              :link="'tel:' + business.afterHoursPhone"
              :caption="business.afterHoursPhoneInstructions"
            >
            </icon-list-item>

            <icon-list-item v-if="business.webLink" icon="fa-globe" :title="getDomain(business.webLink)" :link="business.webLink" />

            <icon-list-item
              v-if="business.twitter"
              icon="fa fa-twitter"
              :title="'@' + business.twitter"
              :link="'https://www.twitter.com/' + business.twitter"
            />

            <icon-list-item
              v-if="business.instagram"
              icon="fa fa-instagram"
              :title="'@' + business.instagram"
              :link="'https://www.instagram.com/' + business.instagram"
            />

            <icon-list-item v-if="business.facebook" icon="fa fa-facebook-square" :title="'Facebook'" :link="business.facebook" />

            <icon-list-item
              v-if="business.email"
              icon="fa-envelope"
              :title="getDomain(business.email)"
              :link="'mailto:' + business.email"
            />
          </p>
          <p v-if="snippet" class="business-actions">
            <span class="list-item" v-if="business.lat && business.lng" @click.stop="getDirections">
              <icon-list-item
                class="directions"
                :class="directionsBool ? 'selected' : 'a'"
                icon="fa-directions"
                :title="$t('getdirections_short')"
                link="#"
              />
            </span>
            <span @click.stop class="list-item" v-if="business.contact">
              <icon-list-item icon="fa-phone-alt" :title="$t('call')" :link="'tel:' + business.contact" />
            </span>
            <span @click.stop class="list-item" v-if="business.webLink">
              <icon-list-item icon="fa-globe" :title="$t('website')" :link="business.webLink" />
            </span>
          </p>
          <p class="directions-options-expanded" id="directions-options-snippet" v-if="snippet && directionsBool" @click.stop>
            <icon-list-item
              v-if="getAddress(business) !== ''"
              class="list-item"
              icon="fa fa-google"
              title="Google Maps"
              :link="googleDirectionsLink(business)"
            />
            <icon-list-item
              v-if="iOS && business.lat && business.lng"
              icon="fa fa-apple"
              title="Apple Maps"
              :link="appleDirectionsLink(business)"
            />
            <icon-list-item
              v-if="business.lat && business.lng"
              icon="fa-waze"
              iconSet="fab"
              title="Waze"
              :link="wazeDirectionsLink(business)"
            />
          </p>

          <opening-hours
            v-if="!snippet"
            :openHours="business.openHours"
            :title="$t('label.openinghours')"
            :description="business.status"
          ></opening-hours>
          <opening-hours
            v-if="!snippet"
            :openHours="Array.isArray(business.specialHours) ? business.specialHours : []"
            :title="$t('label.seniorhours')"
            :description="Array.isArray(business.specialHours) ? '' : business.specialHours"
          ></opening-hours>
          <opening-hours v-if="!snippet" :title="$t('label.holidayhours')" :description="business.holidaysHours"></opening-hours>

          <div v-if="!snippet">
            <template v-if="business.longDescription">
              <p>{{ business.longDescription }}</p>
            </template>
            <template v-if="business.category === 'socialServices' && business.region && business.region.length">
              <p>
                <b>{{ $t('label.serviceregions') }}:</b>
                <tag-list :tags="regionTags"></tag-list>
              </p>
            </template>
            <template v-if="business.populationsServed && business.populationsServed.length">
              <p>
                <b>{{ $t('label.populationsserved') }}:</b>
                <tag-list :tags="business.populationsServed"></tag-list>
              </p>
            </template>
            <template v-if="business.languagesSupported && business.languagesSupported.length">
              <p>
                <b>{{ $t('label.languagessupported') }}:</b>
                <tag-list :tags="business.languagesSupported"></tag-list>
              </p>
            </template>
            <template v-if="business.eligibility">
              <p>
                <b>{{ $t('label.eligibility') }}:</b><br />{{ business.eligibility }}
              </p>
            </template>
            <template v-if="business.resourceAccessNotes">
              <p class="pre">
                <b>{{ $t('label.howtoaccess') }}:</b><br />{{ business.resourceAccessNotes }}
              </p>
            </template>
            <template v-if="business.geographicRestrictions">
              <p>
                <b>{{ $t('label.geographicrestrictions') }}:</b><br />{{ business.geographicRestrictions }}
              </p>
            </template>
            <template v-if="business.instructions">
              <p>
                <b>{{ $t('label.instructions') }}:</b><br />{{ business.instructions }}
              </p>
            </template>
            <template v-if="business.offers !== undefined && !!business.offers">
              <p>
                <b>{{ $t('label.offers') }}:</b><br />{{ business.offers }}
              </p>
            </template>
            <template v-if="business.notes">
              <p>
                <b>{{ $t('label.notes') }}:</b><br />{{ business.notes }}
              </p>
            </template>
            <p class="updated" v-if="getLastUpdatedDate != 'Invalid Date'">
              {{ $t('label.details-last-updated') }}: {{ getLastUpdatedDate }}
            </p>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import OpeningHours from './OpeningHours.vue'
import IconListItem from './IconListItem.vue'
import TagList from './TagList.vue'
import { businessIcon, optionIcon, getAddress, getHoursVal } from '../utilities'
export default {
  name: 'BusinessDetails',
  components: {
    OpeningHours,
    IconListItem,
    TagList
  },
  data() {
    return {
      directionsBool: false
    }
  },
  props: {
    infotype: { type: String },
    icon: { type: String },
    business: Object,
    snippet: Boolean
  },
  methods: {
    getDomain(url) {
      var urlParts = url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)
      return urlParts[0]
    },
    addressUrl(business) {
      var address = business.address ? business.address.replace(/\s/g, '%20') : ''
      var city = business.city ? business.city.replace(/\s/g, '%20') : ''
      var state = business.state ? business.state.replace(/\s/g, '%20') : ''

      return address + '%2C%20' + city + '%2C%20' + state + '%20' + business.zip
    },
    appleDirectionsLink(business) {
      return 'http://maps.apple.com/?q=' + business.address + '&ll=' + business.lat + '%2C' + business.lng
    },
    businessIcon(business) {
      return 'fa ' + businessIcon(business)
    },
    googleDirectionsLink(business) {
      return 'https://www.google.com/maps/dir/?api=1&destination=' + this.addressUrl(business)
    },
    wazeDirectionsLink(business) {
      return 'https://www.waze.com/ul?ll=' + business.lat + '%2C' + business.lng + '&navigate=yes'
    },
    getDirections() {
      this.directionsBool = !this.directionsBool
      this.$emit('business-resize')
    },
    hasDirections(business) {
      return business.address || (business.lat && business.lng)
    },
    expandBusinessDetails() {
      if (this.snippet) {
        this.$emit('toggle-expanding-details')
      }
    },
    toggleExpand() {
      this.$emit('toggle-expanding-details')
    },
    getOptionIcon(opt) {
      return 'fas ' + optionIcon(opt)
    },
    getOpenClosedMessage(business) {
      var label = this.isOpen(business) ? this.$t('label.open') : this.$t('label.closed')

      if (business.isOpen && business.openInfo) {
        if (!business.openInfo.isOpenNow) {
          var time = getHoursVal(business.openInfo.openTime)
          var day = this.$t('dayofweek.' + business.openInfo.openDay)
          label += '. ' + this.$t('label.open-on').replace('{DAY}', day).replace('{TIME}', time)
        }
      }

      return label
    },
    isOpen(business) {
      if (business.openInfo) {
        return business.openInfo.isOpenNow !== false
      } else {
        return business.isOpen
      }
    },
    hasOpenClosedInfo(business) {
      return business.isOpen === false || !!business.openInfo
    },
    getAddress: getAddress
  },
  computed: {
    getLastUpdatedDate() {
      return new Date(Date.parse(this.business.lastUpdate)).toLocaleDateString()
    },
    iOS() {
      return /iPad|iPhone|iPod|Mac OS/.test(navigator.userAgent)
    },
    agent() {
      return navigator.userAgent
    },
    regionTags() {
      return this.business.region.map((r) => {
        return r.name
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mobile-expand {
  display: block;
  width: 50px;
  margin: 0 auto;
  padding: 5px 0;
  top: -5px;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    border: solid 1px #999;
  }

  @include media-breakpoint-up(md) {
    display: none;
  }
}

.business-details {
  max-height: calc(100vh);
  @include media-breakpoint-up(md) {
    max-height: calc(100vh - 174px);
  }
  overflow-y: auto;
  overflow-x: hidden;
}

#sidebar-wrapper.showExpandedDetails .business-details {
  max-height: calc(100vh - 36px);
  @include media-breakpoint-up(md) {
    max-height: calc(100vh - 174px);
  }
}

.back-to-list {
  display: block;
  font-size: 0.8rem;

  i {
    margin-right: 0.375rem;
  }

  // &:hover {
  //   background: rgba(0, 0, 0, 0.05) !important;
  //   cursor: pointer;
  // }
}

.title {
  margin: 0 0 0.75rem 0;
  display: inline-block;
  width: 100%;

  i {
    font-size: 3rem;
    color: theme-color('quinary');
    margin: 7px 10px 7px 0;
    float: left;

    @media (prefers-color-scheme: dark) {
      color: theme-color-level('quinary', 5);
    }
  }
}

.busName {
  margin-left: 64px;
}

.green {
  font-size: 0.8rem;
  // color: #666;

  & > div {
    width: 100%;
  }
}

.updated {
  color: #aaa;
  margin-bottom: 3rem;
  @include media-breakpoint-up(sm) {
    margin-bottom: 0;
  }
}

.directions-options {
  background: $directions-background;

  @media (prefers-color-scheme: dark) {
    background: $directions-background-dark;
  }
}

.business-snippet {
  .business-open {
    display: block;
    margin-bottom: 8px;

    i {
      margin-right: 8px;
      margin-top: 6px;
    }
  }

  @include media-breakpoint-down(sm) {
    .business-options {
      .list-item {
        display: inline-block;
      }

      ::v-deep .iconListItem {
        display: inline-block;

        .ilTitle {
          display: none;
        }
      }
    }

    .business-actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .list-item {
        display: inline-block;
        flex: 1 0 auto;

        &:not(:last-child) {
          margin-right: 8px;
        }

        .directions {
          position: relative;

          ::v-deep .iconListItem {
            background-color: theme-color-level('quaternary');
            color: $white;

            a {
              color: inherit;
              text-decoration: none !important;
            }
          }

          &.selected {
            ::v-deep .iconListItem {
              border-bottom: none;
            }

            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 10px;
              bottom: -10px;
              left: 0;
              background: theme-color-level('quaternary');
              border-left: 1px solid #ddd;
              border-right: 1px solid #ddd;
            }
          }
        }
      }

      ::v-deep .iconListItem {
        width: 100%;
        display: inline-block;
        background: $white;
        padding: 2px 6px;
        border: 1px solid #ddd;

        a {
          color: theme-color-level('quaternary');
        }

        .ilIcon {
          width: auto;
          margin-right: 4px;
        }

        .ilTitle {
          min-width: 0;
        }
      }
    }

    .directions-options-expanded {
      background-color: white;
      border: 1px solid #ddd;
      padding: 10px 6px;
      display: flex;
      justify-content: space-around;
      text-align: center;
      margin-bottom: 4px;
      outline: 1px solid theme-color-level('quaternary');
      outline-offset: -2px;

      ::v-deep .iconListItem {
        //background-color: transparent;

        .ilIcon {
          width: auto;
          margin-right: 4px;
          //color: $white;
        }
        .ilTitle {
          min-width: 0;
          width: auto;
          a {
            color: theme-color-level('quaternary');
          }
        }
      }
    }
  }
}
</style>
