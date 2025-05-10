import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const GENDER_COLORS = ["#0F52BA", "#F9A826", "#4ECB71"];
const AGE_COLOR = "#0F52BA";

export default function Dashboard() {
  const today = format(new Date(), "MMMM d, yyyy");

  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  // Fetch gender distribution for chart
  const { data: genderData, isLoading: genderLoading } = useQuery({
    queryKey: ["/api/dashboard/gender-distribution"],
  });

  // Fetch age distribution for chart
  const { data: ageData, isLoading: ageLoading } = useQuery({
    queryKey: ["/api/dashboard/age-distribution"],
  });

  // Fetch doctor distribution
  const { data: doctorData, isLoading: doctorLoading } = useQuery({
    queryKey: ["/api/dashboard/doctor-distribution"],
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-success-100 text-success";
      case "Limited":
        return "bg-warning-100 text-warning";
      case "Full":
        return "bg-danger-100 text-danger";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <main className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-500">{today}</span>
            <button className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
              <i className="ri-refresh-line mr-1"></i> Refresh
            </button>
          </div>
        </div>

        {/* Cards overview */}
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total patients card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 text-white bg-primary rounded-md">
                  <i className="ri-user-line text-xl"></i>
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-neutral-500">Total Patients Today</h2>
                  {metricsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-3xl font-semibold text-neutral-800">
                      {metrics?.totalPatients || 0}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600">
                <span className="text-success font-medium">
                  <i className="ri-arrow-up-line"></i> {metrics?.patientsChange || 0}%
                </span>{" "}
                from yesterday
              </div>
            </CardContent>
          </Card>

          {/* Appointments card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 text-white bg-secondary rounded-md">
                  <i className="ri-calendar-check-line text-xl"></i>
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-neutral-500">Appointments</h2>
                  {metricsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-3xl font-semibold text-neutral-800">
                      {metrics?.appointments || 0}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600">
                <span className="text-success font-medium">
                  <i className="ri-arrow-up-line"></i> {metrics?.appointmentsChange || 0}%
                </span>{" "}
                from yesterday
              </div>
            </CardContent>
          </Card>

          {/* Waiting patients card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 text-white bg-accent rounded-md">
                  <i className="ri-time-line text-xl"></i>
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-neutral-500">Waiting Patients</h2>
                  {metricsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-3xl font-semibold text-neutral-800">
                      {metrics?.waiting || 0}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600">
                <span className="text-warning font-medium">
                  <i className="ri-time-line"></i> ~{metrics?.avgWaitTime || 0} min
                </span>{" "}
                avg. wait time
              </div>
            </CardContent>
          </Card>

          {/* New registrations card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 text-white bg-info rounded-md">
                  <i className="ri-file-user-line text-xl"></i>
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-neutral-500">New Registrations</h2>
                  {metricsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-3xl font-semibold text-neutral-800">
                      {metrics?.newRegistrations || 0}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600">
                <span className="text-success font-medium">
                  <i className="ri-arrow-up-line"></i> {metrics?.newRegistrationsChange || 0}%
                </span>{" "}
                from yesterday
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and tables */}
        <div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2">
          {/* Gender distribution chart */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-medium text-neutral-800">Gender Distribution</h2>
              {genderLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Skeleton className="h-[180px] w-[180px] rounded-full" />
                </div>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderData?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Age distribution chart */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-medium text-neutral-800">Age Distribution</h2>
              {ageLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Number of Patients" fill={AGE_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Doctor-wise distribution */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-medium text-neutral-800">Doctor-wise Patient Distribution</h2>
              <div className="overflow-x-auto">
                {doctorLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table className="w-full min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Doctor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patients Seen</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Remaining Capacity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {doctorData?.map((doctor: any) => (
                        <tr key={doctor.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                                  {doctor.name.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-neutral-900">{doctor.name}</div>
                                <div className="text-sm text-neutral-500">{doctor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{doctor.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{doctor.patientsSeen}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-neutral-200 rounded-full h-2.5">
                              <div
                                className={`${doctor.slotsLeft === 0 ? "bg-danger" : "bg-primary"} h-2.5 rounded-full`}
                                style={{ width: `${(doctor.patientsSeen / doctor.maxDailyPatients) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-neutral-500 mt-1">{doctor.slotsLeft} slots left</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(doctor.status)}`}>
                              {doctor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
