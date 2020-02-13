  /**
   * Copyright Schrodinger, LLC
   */

  "use strict";

  import React from 'react';
  
  import MainTable from './maintable/MainTable';
  import MainTableDataStore from './maintable/MainTableDataStore';
  
  class App extends React.Component {
  
    render() {

      var datastore = new MainTableDataStore();
      datastore.createFakeObjectData();

      return (
        <MainTable dataset={datastore}/>
      );
    }
  }

  export default App;