using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Appraisals.Models
{
    public class Templates
    {
        public string template_id { get; set; }
        public string template_name { get; set; }
        public string date_created { get; set; }
        public string state { get; set; }
        public string template_object { get; set; }
    }
}