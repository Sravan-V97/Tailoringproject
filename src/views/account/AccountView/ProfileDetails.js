import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import firebaseDb from '../../../firebase';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Select,
  Input,
  MenuItem
} from '@material-ui/core';
import { v4 as uuid } from 'uuid';
import course_data from 'src/data/course_data';
import { useTheme } from '@material-ui/core/styles';
import './profile.css';
import data from 'src/views/customer/CustomerListView/data';
const states = [
  {
    value: 'kerala',
    label: 'Kerala'
  },
  {
    value: 'tamilnadu',
    label: 'Tamilnadu'
  }
];

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}
const ProfileDetails = ({ className, ...rest }) => {
  var [courseObjects, setCourseObjects] = useState({});
  useEffect(() => {
    firebaseDb.child('coursedetails').on('value', snapshot => {
      if (snapshot.val() != null)
        setCourseObjects({
          ...snapshot.val()
        });
    });
  }, []);
  const classes = useStyles();
  const theme = useTheme();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    country: '',
    course: []
  });

  const handleChange = event => {
    console.log(event.target.value, event.target.name);
    if (event.target.name === 'course') {
      if (values[event.target.name].length < 2) {
        setValues({
          ...values,
          [event.target.name]: event.target.value
        });
      }
    } else {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    }
  };
  const handleSubmit = () => {
    let data = {
      id: uuid(),
      address: {
        country: values.country,
        state: values.state,
        city: values.city,
        street: values.street
      },
      avatarUrl: '/static/images/avatars/avatar_3.png',
      createdAt: Date.now(),
      email: values.email,
      name: values.name,
      phone: values.phone
    };
    addEdit();
    console.log(data);
  };

  const addEdit = () => {
    firebaseDb.child('studentdetails').push(values);
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Add Student"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {states.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="City"
                name="City"
                onChange={handleChange}
                type="text"
                value={values.city}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Street"
                name="street"
                onChange={handleChange}
                type="text"
                value={values.street}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                multiple
                value={values.course}
                onChange={handleChange}
                input={<Input />}
                MenuProps={MenuProps}
                name="course"
                variant="outlined"
                className="w-100"
              >
                {Object.keys(courseObjects).map(id => (
                  <MenuItem
                    key={courseObjects[id].id}
                    value={courseObjects[id].courseTitle}
                    style={getStyles(
                      courseObjects[id].courseTitle,
                      values.course,
                      theme
                    )}
                  >
                    {/* {JSON.stringify(courseObjects[id])} */}
                    {courseObjects[id].courseTitle}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
