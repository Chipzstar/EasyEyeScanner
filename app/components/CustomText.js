import React from 'react';
import {Text } from 'react-native';

class CustomText extends React.Component {
	setFontType = type => {
		switch (type) {
			case 'black':
				return 'Roboto-Black';
			case 'bold':
				return 'Roboto-Bold';
			case 'italic':
				return 'Roboto-Italic';
			case 'medium':
				return 'Roboto-Medium';
			default:
				return 'Roboto-Regular';
		}
	};

	render() {
		const font = this.setFontType(this.props.type ? this.props.type : 'normal');
		const style = [{ fontFamily: font }, this.props.style || {}];
		const allProps = Object.assign({}, this.props, { style: style });
		return <Text {...allProps}>{this.props.children}</Text>;
	}
}
export default CustomText;
