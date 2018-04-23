<template>
  <section class="hero is-light is-fullheight">
    <div class="hero-head">
      <div class="container has-text-centered">
        <b-field position="is-centered" grouped>
          <b-field label="Buy Rate">
            <b-input v-model="yourRate" placeholder="Buy Rate"
                type="number"
                step="any"
                size="is-medium"
                icon="coins"
                max="1000000">
            </b-input>
          </b-field>
          <b-field label="Sell Rate">
            <b-input v-model="yourRate" placeholder="Sell Rate"
                type="number"
                step="any"
                size="is-medium"
                icon="coins"
                max="1000000">
            </b-input>
          </b-field>
        </b-field>
      </div>
    </div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <img class="logo" :src="logo" alt="RikoZone">
        <h1 class="title">
          Vue Currency Converter
        </h1>
        <div class=" has-text-centered">
          <b-field position="is-centered">
            <b-radio-button v-model="action" size="is-medium"
                native-value="buy">
                Buy
            </b-radio-button>
            <b-radio-button v-model="action" size="is-medium"
                native-value="sell">
                Sell
            </b-radio-button>
          </b-field>
          <b-field grouped expanded>
            <b-field>
              <b-input v-model="amount1" @input="getFiatVal" :placeholder="amount11"
                  type="number"
                  step="any"
                  size="is-large"
                  icon="coins"
                  max="1000000"
                  :loading="busy">
              </b-input>
              <b-select v-model="currency1" @input="exRate" placeholder="Currency" size="is-large">
                  <option v-for="crypto in cryptos" :value="crypto.acronym">{{ crypto.name }}</option>
              </b-select>
            </b-field>
            <b-icon
                icon="repeat"
                size="is-large">
            </b-icon>

            <b-field>
                <b-input v-model="amount2" @input="getCryptoVal" :placeholder="amount21"
                    type="number"
                    step="any"
                    size="is-large"
                    icon="cash-multiple"
                    max="9999999999"
                    :loading="busy">
                </b-input>
                <b-select v-model="currency2" @input="exRate" placeholder="Currency"size="is-large" >
                    <option v-for="fiat in fiats" :value="fiat.acronym">{{ fiat.name }}</option>
                </b-select>
            </b-field>
          </b-field>
          {{ currency1 }} => {{ currency2 }}

        </div>
      </div>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <div class="container">
        <b-taglist attached>
          <b-tag type="is-dark" size="is-medium">copyright&copy;</b-tag>
          <b-tag type="is-primary" size="is-medium">{{ year }}</b-tag>
        </b-taglist>
      </div>
    </div>
  </section>
</template>

<script>
import API from './api'
import logo from './assets/img/logo.png'

const date = new Date();

export default {
  name: 'app',
  data () {
    return {
      busy: false,
      logo,
      year: date.getFullYear(),
      cryptos: [
        { acronym: 'BTC', name: 'BitCoin'},
        { acronym: 'BCH', name: 'BitCoin Cash'},
        { acronym: 'ETH', name: 'Ethereum'},
        { acronym: 'LTC', name: 'LiteCoin'}
      ],
      fiats: [
        { acronym: 'USD', name: 'US Dollar'},
        { acronym: 'EUR', name: 'Euro'},
        { acronym: 'GBP', name: 'Pounds'},
        { acronym: 'NGN', name: 'Naira'}
      ],
      amount1: null,
      amount11: 0,
      amount2: null,
      amount21: 0,
      currency1: 'BTC',
      currency2: 'USD',
      msg: '',
      yourRate: 3.5,
      action: 'buy'
    }
  },
  methods: {
    toast() {
      this.$toast.open({
        duration: 5000,
        type: 'is-dark',
        message: this.msg
      })
    },
    exRate() {
      if (this.amount1) {
        this.getFiatVal()
      } else if (this.amount2) {
        this.getCryptoVal()
      } else {
        //do nothing
      }
    },
    getFiatVal() {
      this.busy = true
      this.amount2 = null
      var cur1 = this.currency1
      var cur2 = this.currency2
      var amt1 = this.amount1
      var myRate = this.yourRate
      var uv = this
      API.get('/price?fsym=' + cur1 + '&tsyms=' + cur2)
      .then(response => {
        var rate = response.data
        //console.log(rate)
        if (cur2 == 'USD') {
          uv.amount21 = ((amt1 * rate.USD) + ((myRate/100) * rate.USD)).toFixed(2)
        } else if (cur2 == 'EUR') {
          uv.amount21 = ((amt1 * rate.EUR) + ((myRate/100) * rate.EUR)).toFixed(2)
        } else if (cur2 == 'GBP') {
          uv.amount21 = ((amt1 * rate.GBP) + ((myRate/100) * rate.GBP)).toFixed(2)
        } else {
          uv.amount21 = ((amt1 * rate.NGN) + ((myRate/100) * rate.NGN)).toFixed(2)
        }
        uv.busy = false
      }).catch(error => {
        uv.msg = "Network Error!!.. Check device connectivity"
        uv.busy = false
        uv.toast()

      })
    },
    getCryptoVal() {
      this.busy = true
      this.amount1 = null
      var cur1 = this.currency1
      var cur2 = this.currency2
      var amt2 = this.amount2
      var myRate = this.yourRate
      var uv = this
      API.get('/price?fsym=' + cur1 + '&tsyms=' + cur2)
      .then(function(response) {
        var rate = response.data
        //console.log(rate)
        if (cur2 == 'USD') {
          uv.amount11 = ((amt2 / rate.USD) - ((myRate/100) * (amt2 / rate.USD))).toFixed(8)
        } else if (cur2 == 'EUR') {
          uv.amount11 = ((amt2 / rate.EUR) - ((myRate/100) * (amt2 / rate.EUR))).toFixed(8)
        } else if (cur2 == 'GBP') {
          uv.amount11 = ((amt2 / rate.GBP) - ((myRate/100) * (amt2 / rate.GBP))).toFixed(8)
        } else {
          uv.amount11 = ((amt2 / rate.NGN) - ((myRate/100) * (amt2 / rate.NGN))).toFixed(8)
        }
        uv.busy = false
      }).catch(function(error) {
        uv.msg = "Network Error!!.. Check device connectivity"
        uv.busy = false
        uv.toast()

      })
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss">
.logo {
  width: 200px;
}
</style>
