import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    utxoUrl: state.settings.api.utxoUrl,
    addressBalanceUrl: state.settings.api.addressBalanceUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class Balance extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    balances: PropTypes.object.isRequired,
    refreshBalances: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired,
    utxoUrl: PropTypes.string.isRequired,
    addressBalanceUrl: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      coreWalletBalance: 0
    }
    this.updateBalancesFromCore = this.updateBalancesFromCore.bind(this)
  }

  componentDidMount() {
    this.updateBalancesFromCore()
  }

  updateBalancesFromCore() {
    fetch(this.props.walletPaymentAddressUrl)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const address = responseJson.address
      const url = this.props.addressBalanceUrl.replace('{address}', address)
      fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        const balance = responseJson.unconfirmedBalance + responseJson.balance
        this.setState({coreWalletBalance: balance})
      })
    })
  }
  render() {
    return (
      <div className="balance">
        <label>Balance:</label>
        &nbsp;
        {this.state.coreWalletBalance}&nbsp;
        <label>btc</label>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
