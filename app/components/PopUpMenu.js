import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { UIManager, findNodeHandle } from 'react-native';
import {Button, Icon} from 'native-base';

export default class PopUpMenu extends Component {
	static propTypes = {
		// array of strings, will be list items of Menu
		actions: PropTypes.arrayOf(PropTypes.string).isRequired,
		onPress: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			icon: null
		}
	}

	onError() {
		console.error('Popup Error')
	}

	onPress = () => {
		if (this.state.icon) {
			UIManager.showPopupMenu(
				findNodeHandle(this.state.icon),
				this.props.actions,
				this.onError,
				this.props.onPress
			)
		}
	};

	render() {
		return (
			<Button
				transparent
				accessibilityLabel={"Options"}
				accessibilityHint={"Click to see more options"}
				onPress={this.onPress}
			>
				<Icon
					name='more'
					color={this.props.color}
					ref={this.onRef}
				/>
			</Button>
		)
	}

	onRef = icon => {
		if (!this.state.icon) {
			this.setState({icon})
		}
	}
}
