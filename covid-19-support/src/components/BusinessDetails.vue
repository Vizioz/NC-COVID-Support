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
                <span v-if="!!business.providerAddLoc">{{ business.providerAddLoc }}</span>
                <template v-if="!!business.classificationType">{{ business.classificationType }}</template>
              </div>
            </div>
          </div>
          <template v-if="business.description">
            <p>{{ business.description }}</p>
          </template>
          <div v-if="!snippet && getAddress(business) !== ''">
            <b>{{ $t('label.address') }}:</b><br />
            {{ getAddress(business) }}<br />
            <span class="list-item" @click.stop="getDirections">
              <icon-list-item icon="fa-directions" :title="$t('getdirections')" link="#" />
            </span>
            <p id="directions-options-expanded" v-if="directionsBool" class="directions-options list-item">
              <icon-list-item class="list-item" icon="fa fa-google" title="Google Maps" :link="googleDirectionsLink(business)" />
              <icon-list-item
                class="list-item"
                v-if="iOS"
                icon="fa fa-apple"
                title="Apple Maps"
                :link="appleDirectionsLink(business.marker)"
              />
              <icon-list-item class="list-item" icon="fa-waze" iconSet="fab" title="Waze" :link="wazeDirectionsLink(business)" />
            </p>
          </div>
          <p>
            <icon-list-item
              v-for="(opt, index) in business.options"
              v-bind:key="index"
              :icon="getOptionIcon(opt)"
              :title="$tc('label.' + opt)"
            />
          </p>

          <p>
            <icon-list-item v-if="business.contact" icon="fa-phone-alt" :title="business.contact" :link="'tel:' + business.contact" />

            <icon-list-item
              v-if="business.contactspanish"
              icon="fa-phone-alt"
              :title="business.contactspanish + ' (' + $t('languages.es').toLowerCase() + ')'"
              :link="'tel:' + business.contactspanish"
            />

            <icon-list-item v-if="business.weblink" icon="fa-globe" :title="getDomain(business.weblink)" :link="business.weblink" />

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
            <span class="list-item" @click.stop="getDirections">
              <icon-list-item
                class="directions"
                :class="directionsBool ? 'selected' : 'a'"
                icon="fa-directions"
                :title="$t('getdirections_short')"
                link="#"
              />
            </span>
            <span @click.stop class="list-item">
              <icon-list-item
                v-if="business.marker.gsx$contact !== undefined && !!business.marker.gsx$contact.$t"
                icon="fa-phone-alt"
                :title="$t('call')"
                :link="'tel:' + business.marker.gsx$contact.$t"
              />
            </span>
            <span @click.stop class="list-item">
              <icon-list-item
                v-if="business.marker.gsx$weblink !== undefined && !!business.marker.gsx$weblink.$t"
                icon="fa-globe"
                :title="$t('website')"
                :link="business.marker.gsx$weblink.$t"
              />
            </span>
          </p>
          <p class="directions-options-expanded" id="directions-options-snippet" v-if="snippet && directionsBool" @click.stop>
            <icon-list-item class="list-item" icon="fa fa-google" title="Google Maps" :link="googleDirectionsLink(business.marker)" />
            <icon-list-item v-if="iOS" icon="fa fa-apple" title="Apple Maps" :link="appleDirectionsLink(business.marker)" />
            <icon-list-item icon="fa-waze" iconSet="fab" title="Waze" :link="wazeDirectionsLink(business.marker)" />
          </p>

          <opening-hours :openHours="business.openHours" :title="$t('label.openinghours')" :description="business.status"></opening-hours>
          <opening-hours
            :openHours="Array.isArray(business.specialHours) ? business.specialHours : []"
            :title="$t('label.seniorhours')"
            :description="Array.isArray(business.specialHours) ? '' : business.specialHours"
          ></opening-hours>
          <opening-hours :title="$t('label.holidayhours')" :description="business.holidaysHours"></opening-hours>

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
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import OpeningHours from './OpeningHours.vue'
import IconListItem from './IconListItem.vue'
import { businessIcon, optionIcon, getAddress } from '../utilities'
export default {
  name: 'BusinessDetails',
  components: {
    OpeningHours,
    IconListItem
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
      var address = business.address
      address = address.replace(/\s/g, '%20')
      var city = business.city.replace(/\s/g, '%20')
      var state = business.state.replace(/\s/g, '%20')
      address = address + '%2C%20' + city + '%2C%20' + state + '%20' + business.zip
      return address
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
  margin-left: 54px;
  min-width: 208px;
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
