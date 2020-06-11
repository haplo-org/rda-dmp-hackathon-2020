# RDA machine-actionable Data Management Plans hackathon

The code in this repository was used for the [RDA hackathon on maDMPs 2020](https://rda-dmp-common.github.io/hackathon-2020/).

**These plugins should not be used in a production environment** without further development and QA.

## Proof of Concept functionality achieved:

Users are now able to:

* Push DMPs created in Haplo to DMPRoadmap

* Read public DMPs from DMPRoadmap into Haplo, using the DMPRoadmap ID

DMPs imported from DMPRoadmap can then be extended with additional information from other modules in place in the Haplo application. Information could be sourced from the the Funding, Ethics, or Repository Haplo modules to fill out additional information in the DMP document.


For development purposes this plugin should be installed alongside the rest of the [Haplo Repository plugins](https://github.com/haplo-org/haplo-repository).

The repository contains three plugins:

### `hres_dmproadmap_integration`

A new plugin for communicating with the WIP [DMPRoadmap v1 API](https://github.com/DMPRoadmap/roadmap/wiki/API-Documentation-V1). This correctly exchanges authentication tokens, and allows users to import DMPs created within DMPRoadmap to Haplo.

### `hres_data_management_plans`

A development version of the open-source [Haplo DMP](https://www.haplo.com/news/haplo-repository-dmp) plugin. This adds temporary UI to allow users to connect to DMPRoadmap.

### `hres_data_management_plans_standalone`

A proof of concept API to expose DMPs from Haplo to external systems. The `/api/hres-data-management-plans-standalone/get-plan/PROJECT_REF` endpoint returns the DMP for a project as a JSON document.

This API **should not** be used in production, as it does not require authentication. Read permissions are enforced using a service user.
