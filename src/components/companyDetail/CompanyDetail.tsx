import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import { AxiosError } from "axios";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { getCompanyDetail, updateCompany } from "../../api/companyApi";
import { getUserDetail } from "../../api/authApi";
import {
  organizationCountries,
  organizationIndustries,
} from "../../api/organizationRegistrationApi";
import { COMPANY_DETAIL } from "../../utils/constants";
import { CompanyDetails } from "../../utils/interfaces/companyDetailInterface";

const CompanyDetail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allIndusties, setAllIndustries] = useState<any[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    industryIds: [],
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleInputChange = (field: keyof CompanyDetails, value: any) => {
    setCompanyDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const { mutate: mutateGetUserDetail } = useMutation({
    mutationFn: getUserDetail,
    onSuccess: (res) => {
      setOrganizationId(res?.data?.organizationId);
    },
    onError: (error: AxiosError<{ message: string }>)=> {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: mutateGetAllIndustries } = useMutation({
    mutationFn: organizationIndustries,
    onSuccess: (res) => {
      setAllIndustries(res?.data?.records || []);
    },
    onError: (error: AxiosError<{ message: string }>)=> {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: mutateGetAllCountries } = useMutation({
    mutationFn: organizationCountries,
    onSuccess: (res) => {
      setAllCountries(res?.data?.countries || []);
    },
    onError: (error: AxiosError<{ message: string }>)=> {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: mutateGetCompanyDetail } = useMutation({
    mutationFn: getCompanyDetail,
    onSuccess: (res) => {
      const data = res?.data;      
      setCompanyDetails({
        industryIds: data?.industries?.map((item: any) => Number(item.id)) || [],
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        country: data?.country || "",
        zipCode: data?.zipCode || "",
      });
    },
    onError: (error: AxiosError<{ message: string }>)=> {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: mutateEditCompany } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyDetails }) =>
      updateCompany(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      setIsLoading(false);
    },
    onError: (error: AxiosError<{ message: string }>)=> {
      toast.error(error?.response?.data?.message || "An error occurred");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (organizationId !== 0) {
      mutateEditCompany({ id: organizationId, data: companyDetails });
    }
  };

  useEffect(() => {
    mutateGetUserDetail();
    mutateGetAllIndustries();
    mutateGetAllCountries();
    mutateGetCompanyDetail();
  }, []);

  return (
    <form className="m-[50px]" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid  size={{xs:12}}>
          <span className="font-extrabold text-headingColor text-lg">
            {COMPANY_DETAIL?.heading}
          </span>
        </Grid>
        <Grid size={{xs:6}}  className="mt-[20px]">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="Industry-label">Industry</InputLabel>
            <Select
              labelId="Industry-label"
              label="Industry"
              variant="outlined"
              name="industry"
              multiple
              value={companyDetails?.industryIds}
              onChange={(e) =>
                handleInputChange("industryIds", e?.target?.value)
              }
            >
              {allIndusties.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{xs:6}} className="mt-[20px]">
          <TextField
            label="Company Address"
            variant="outlined"
            fullWidth
            name="companyAddress"
            value={companyDetails?.address}
            onChange={(e) => handleInputChange("address", e?.target?.value)}
          />
        </Grid>
        <Grid size={{xs:6}} className="mt-[20px]">
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            name="city"
            value={companyDetails?.city}
            onChange={(e) => handleInputChange("city", e?.target?.value)}
          />
        </Grid>
        <Grid size={{xs:6}} className="mt-[20px]">
          <TextField
            label="Province/State"
            variant="outlined"
            fullWidth
            name="state"
            value={companyDetails?.state}
            onChange={(e) => handleInputChange("state", e?.target?.value)}
          />
        </Grid>
        <Grid size={{xs:6}} className="mt-[20px]">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="Country-label">Country</InputLabel>
            <Select
              labelId="Country-label"
              label="Country"
              variant="outlined"
              name="country"
              value={companyDetails?.country}
              onChange={(e) =>
                handleInputChange("country", e?.target?.value)
              }
            >
              {allCountries.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{xs:6}} className="mt-[20px]">
          <TextField
            label="Zip/Postal Code"
            variant="outlined"
            fullWidth
            name="zipCode"
            type="number"
            value={companyDetails?.zipCode}
            onChange={(e) => handleInputChange("zipCode", e?.target?.value)}
          />
        </Grid>
        <Grid size={{xs:12}} className="mt-[20px] text-right">
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded w-[220px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Save changes"
            )}
          </button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CompanyDetail;
