import React, { Component } from 'react';
import { Formik, useFormikContext } from 'formik';


/**
 * 
 * @param  initialValues: Object with string values 
 * @param  onSubmit: jsx function 
 * @param  validationSchema: Schema 
 *   
 */


export class AppForm extends Component<any>{
    render() {
        return (
            <Formik
                initialValues={this.props.initialValues}
                onSubmit={this.props.onSubmit}
                validationSchema={this.props.validationSchema}
            >
                {() => (<>{this.props.children}</>)}
            </Formik>
        )
    }
}
