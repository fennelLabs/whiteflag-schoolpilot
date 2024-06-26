module "gce-container" {
  source = "terraform-google-modules/container-vm/google"
  version = "~> 2.0" 

  container = {
    image = "ubuntu-os-cloud/ubuntu-2004-lts"
  }
}

resource "google_storage_bucket_object" "startup" {
  name   = "fennel-whiteflag-terraform-start.sh"
  bucket = "whiteflag-0-admin"
  source = "fennel-whiteflag-terraform-start.sh"
  content_type = "text/plain"
}

resource "google_compute_address" "fennel-whiteflag-ip" {
  name = "fennel-whiteflag-ip"
}

resource "google_compute_instance" "fennel-whiteflag" {
  name         = "fennel-whiteflag-instance"
  machine_type = "e2-small"
  zone         = "us-east1-b"
  allow_stopping_for_update = true 

  can_ip_forward = true
  tags = ["public-server"]
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network    = "whiteflag-sandbox-vpc"
    subnetwork = "public-subnet"
    access_config {
      nat_ip = google_compute_address.fennel-whiteflag-ip.address
    }
  } 

 metadata = {
    startup-script-url = "gs://whiteflag-0-admin/fennel-whiteflag-terraform-start.sh"
    gce-container-declaration = module.gce-container.metadata_value
    google-logging-enabled    = "true"
    google-monitoring-enabled = "true"
  }
 
  service_account {
    scopes = ["cloud-platform"]
  }
}

resource "google_storage_bucket_object" "fennel-whiteflag-ip" {
  name   = "fennel-whiteflag-ip.sh"
  bucket = "whiteflag-0-admin"
  content = google_compute_address.fennel-whiteflag-ip.address
}
