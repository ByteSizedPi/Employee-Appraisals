using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;

using Appraisals.Models;

using System.Configuration;
using System.Data;
using System.Data.SqlClient;

using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Appraisals.Models
{
    public class Users
    {
        public string username { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string department { get; set; }
        public string rank { get; set; }
        public string date_created { get; set; }
    }
}